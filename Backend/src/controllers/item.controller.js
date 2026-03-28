import itemModel from "../models/itemModel.js";
import userModel from "../models/userModel.js";
import { extractMetadata } from "../services/scraping.service.js";
import mongoose from "mongoose";
import { getEmbedding } from "../utils/embedding.js";
import { generateTags } from "../utils/generateTags.js";

export async function createItemController(req, res) {
  console.log("Incoming data", req.body);
  const userId = req.user.id;
  const { url, title, description, thumbnail, type, tags } = req.body;

  try {
    const existingItem = await itemModel.findOne({ url, user: userId });

    if (!url || url.trim() === "") {
      return res.status(400).json({
        message: "URL is required",
        success: false,
      });
    }

    if (existingItem) {
      return res.status(409).json({
        message: "This URL is already saved",
        success: false,
      });
    }

    let contentType = null;
    const lowerUrl = url?.toLowerCase();

    if (lowerUrl.includes("youtube") || lowerUrl.includes("youtu.be")) {
      contentType = "video";
    } else if (lowerUrl.includes(".pdf")) {
      contentType = "article";
    } else if (
      lowerUrl.includes(".jpg") ||
      lowerUrl.includes(".jpeg") ||
      lowerUrl.includes(".png")
    ) {
      contentType = "image";
    }

    let metadata;

    if (url) {
      try {
        metadata = await extractMetadata(url);
      } catch (error) {
        console.log("Metadata fetch failed:", error.message);
      }
    }

    const DEFAULT_IMAGE =
      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png?_=20210219185637";

    const finalTitle =
      metadata?.title ||
      title ||
      //https://www.ndtv.com/india-news/wrong-aircraft-air-indias-canada-flights-u-turn-after-4-hours-in-air-11243441?pfrom=home-ndtv_topscroll
      (url
        ? url
            .split("/")
            .pop()
            .replace(/-[0-9]+$/, " ")
        : "Untitled");

    const finalDescription =
      description || metadata?.description || "No description provided";

    const finalThumbnail = thumbnail || metadata?.image || DEFAULT_IMAGE;

    const finalType = contentType || type || "article";

    const finalTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags.split(",").map((tag) => tag.trim())
        : [];

    //create content for embedding
    const content = `
          Title: ${finalTitle}
          Description: ${finalDescription}
          Type: ${finalType}
          Tags: ${finalTags.join(", ")}
          `.trim();

    //generate embedding
    const embedding = await getEmbedding(content);
    //generate tags
    let aiTags = [];
    try {
      aiTags = await generateTags(content);
    } catch (error) {
      console.error("Tag generation failed:", error.message);
    }

    //merged Tags
    // const mergedTags = [...new Set([...finalTags, ...aiTags]).toLowerCase()].slice(0, 5); // Limit to 5 unique tags

    // console.log("Merged Tags:", mergedTags);

    const itemData = await itemModel.create({
      user: userId,
      url,
      title: finalTitle,
      description: finalDescription,
      content,
      thumbnail: finalThumbnail,
      type: finalType,
      tags: [...finalTags, ...aiTags], // Use the merged tags
      embedding,
    });

    res.status(201).json({
      message: "Item created successfully",
      success: true,
      itemData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      success: false,
      err: error.message,
    });
  }
}

export async function semanticSearchController(req, res) {
  const { q } = req.query;
  const userId = req.user.id;

  if (!q || q.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Search query cannot be empty",
    });
  }

  // 2. Prevent the BSONError Crash
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized or invalid user ID format",
    });
  }

  try {
    const enhancedQuery = `
        User is searching for: ${q}
        Find related content about this topic.
      `;
    const queryEmbedding = await getEmbedding(enhancedQuery);

    let results = await itemModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_search",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 400,
          limit: 10,
          filter: {
            user: new mongoose.Types.ObjectId(userId),
          },
        },
      },
    ]);

    if (results.length === 0) {
      results = await itemModel
        .find({
          user: userId,
          $text: { $search: q },
        })
        .limit(10);
    }

    res.status(200).json({
      message: "Search complete",
      success: true,
      results,
    });
  } catch (error) {
    console.error("Semantic Search Error: ", error);
    res.status(200).json({
      success: false,
      message: "search failed",
    });
  }
}

export async function getRelatedItemsController(req, res) {
  const { itemId } = req.params;
  const userId = req.user.id;

  // 1. Guard Clause: Validate the itemId from the URL parameter
  if (
    !itemId ||
    itemId === "undefined" ||
    !mongoose.Types.ObjectId.isValid(itemId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing Item ID.",
    });
  }

  // 2. Guard Clause: Validate the userId from the auth middleware
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized or invalid User ID format.",
    });
  }

  try {
    const item = await itemModel.findById(itemId);

    if (!item || !item.embedding?.length) {
      return res.status(404).json({
        success: false,
        message: "Item or embedding not found",
      });
    }

    const results = await itemModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: item.embedding,
          numCandidates: 100,
          limit: 6,
          filter: {
            user: new mongoose.Types.ObjectId(userId),
          },
        },
      },
      {
        $match: {
          _id: { $ne: item._id }, // ❌ exclude same item
        },
      },
    ]);

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Related Items Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch related items",
    });
  }
}

export async function getItemsController(req, res) {
  try {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 12), 50);
    //http://localhost:5000/api/item/get-items?q=AI&type=video&tag=productivity&page=1&limit=10 -> postman ke query me bhejo

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({
        message: "Page and Limit must be valid numbers",
      });
    }
    const { q, type, tag } = req.query;

    //Search Items
    let filter = { user: userId }; // ye filter har query me chahiye because hume sirf authenticated user ke items chahiye

    if (q) {
      filter.$text = { $search: q };
    }

    if (type) {
      filter.type = type;
    } //ye filter user ke items me se search query aur type ke basis pe items ko filter karega

    if (tag) {
      const tagsArray = tag.split(",").map((e) => e.trim()); //split hone ke baad trim ho jayenge
      filter.tags = { $in: tagsArray };
    } //ye filter user ke items me se search query, type aur tag ke basis pe items ko filter karega

    //sorting

    const skip = (page - 1) * limit;

    const items = await itemModel
      .find(
        q ? { ...filter, $text: { $search: q } } : filter,
        q ? { score: { $meta: "textScore" } } : {},
      )
      .sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit);

    //pagination

    const totalDocuments = await itemModel.countDocuments(filter); //total documents with applied filters
    const totalPages = Math.ceil(totalDocuments / limit);

    //Final Response
    res.status(200).json({
      message:
        items.length > 0 ? "Items fetched successfully" : "No items found",
      success: true,
      totalItems: totalDocuments,
      totalPages: totalPages,
      currentPage: page,
      items,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
}

export async function getItemByIdController(req, res) {
  const itemId = req.params.id;
  const userId = req.user.id;
  const isValidId = mongoose.Types.ObjectId.isValid(itemId); //ye check karega ki id valid hai ya nahi

  try {
    if (!isValidId) {
      return res.status(400).json({
        message: "Invalid ID",
        success: false,
      });
    }

    const item = await itemModel.findOne({ _id: itemId, user: userId });

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Item fetched successfully",
      success: true,
      data: item,
    });
  } catch (error) {}
}

export async function deleteItemController(req, res) {
  const itemId = req.params.id;
  const userId = req.user.id;
  const isValidId = mongoose.Types.ObjectId.isValid(itemId);

  try {
    if (!isValidId) {
      return res.status(400).json({
        message: "Invalid ID",
        success: false,
      });
    }

    const item = await itemModel.findOneAndDelete({
      _id: itemId,
      user: userId,
    });

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Item deleted successfully",
      success: true,
      data: {
        deleted_item_id: item._id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong...",
      success: false,
    });
  }
}

export async function updateItemController(req, res) {
  const itemId = req.params.id;
  const userId = req.user.id;
  const { title, description, thumbnail, type, tags } = req.body;

  const isValidId = mongoose.Types.ObjectId.isValid(itemId);

  try {
    if (!isValidId) {
      return res.status(400).json({
        message: "Invalid ID",
        success: false,
      });
    }

    let updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (type !== undefined) updateData.type = type;
    if (tags !== undefined) updateData.tags = tags;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No fields provided to update",
        success: false,
      });
    }

    const updatedItem = await itemModel.findOneAndUpdate(
      { _id: itemId, user: userId },
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedItem) {
      return res.status(404).json({
        message: "Item not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Item updated successfully!",
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong...",
      success: false,
      error: error.message,
    });
  }
}
