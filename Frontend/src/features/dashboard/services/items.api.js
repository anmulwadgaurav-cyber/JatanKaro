import axios from "axios";

const api = axios.create({
  baseURL: "https://jatankaro.onrender.com/api/items",
  withCredentials: true,
});

export async function createItem({
  url,
  title,
  description,
  thumbnail,
  type,
  tags,
} = {}) {
  const response = await api.post("/create-item", {
    url,
    title,
    description,
    thumbnail,
    type,
    tags,
  });
  return response.data;
}

export async function getItems({ q = "", type, tag, page, limit } = {}) {
  try {
    const hasQuery = q?.trim().length > 2;

    const standardFetch = api.get("/get-items", {
      params: { q, type, tag, page, limit },
    });

    let semanticFetch = Promise.resolve({ data: { results: [] } });

    if (hasQuery) {
      semanticFetch = api.get("/semantic-search", {
        params: { q },
      });
    }

    const [standardRes, semanticRes] = await Promise.all([
      standardFetch,
      semanticFetch,
    ]);

    const standardItems = standardRes.data.items || [];
    const semanticItems = semanticRes.data.results || [];

    // 🔥 semantic first
    const combinedItems = [...semanticItems, ...standardItems];

    // ✅ remove duplicates
    const uniqueItems = Array.from(
      new Map(combinedItems.map((item) => [item._id, item])).values(),
    );

    return uniqueItems;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    throw error;
  }
}

export async function getRelatedItemsController(id) {
  const response = await api.get(`/related/${id}`);
  // console.log(response.data.results)
  return response.data.results;
}

export async function getItemById(id) {
  const response = await api.get(`/get-item/${id}`);
  return response.data;
}

export async function updateItemById({
  id,
  title,
  description,
  thumbnail,
  type,
  tags,
}) {
  const response = await api.patch(`/update-item/${id}`, {
    title,
    description,
    thumbnail,
    type,
    tags,
  });
  return response.data;
}

export async function deleteItemById(id) {
  const response = await api.delete(`/delete-item/${id}`);
  return response.data;
}
