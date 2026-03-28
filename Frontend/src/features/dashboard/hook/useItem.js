import {
  createItem,
  getItems,
  getItemById,
  updateItemById,
  deleteItemById,
  getRelatedItemsController,
} from "../services/items.api";
import {
  setItemLoading,
  setItemError,
  setItems,
  addItem,
  addParticularItem,
  updateItem,
  addRelatedItems,
} from "../../slices/items.slice";
import { useDispatch } from "react-redux";

export function useItem() {
  const dispatch = useDispatch();
  async function handleCreateItem({
    url,
    title,
    description,
    thumbnail,
    type,
    tags,
  } = {}) {
    try {
      setItemLoading(true);
      const data = await createItem({
        url,
        title,
        description,
        thumbnail,
        type,
        tags,
      });
      dispatch(addItem(data.itemData));
    } catch (error) {
      dispatch(
        setItemError(
          error.response?.data?.message || "Failed to fetch user data",
        ),
      );
    } finally {
      setItemLoading(false);
    }
  }

  async function handleGetItems({ q, type, tag, page, limit } = {}) {
    try {
      setItemLoading(true);
      const data = await getItems({ q, type, tag, page, limit });
      dispatch(setItems(data));
    } catch (error) {
      dispatch(
        setItemError(
          error.response?.data?.message || "Failed to fetch user data",
        ),
      );
    } finally {
      setItemLoading(false);
    }
  }

  async function handleGetItemById(id) {
    try {
      setItemLoading(true);
      const data = await getItemById(id);
      dispatch(addParticularItem(data.data));
    } catch (error) {
      dispatch(
        setItemError(
          error.response?.data?.message || "Failed to fetch user data",
        ),
      );
    } finally {
      setItemLoading(false);
    }
  }

  async function handleUpdateItemById({
    id,
    title,
    description,
    thumbnail,
    type,
    tags,
  }) {
    try {
      setItemLoading(true);
      const data = await updateItemById({
        id,
        title,
        description,
        thumbnail,
        type,
        tags,
      });
      dispatch(updateItem(data.item));
      // console.log("dispatch called")
    } catch (error) {
      // console.log("UPDATE ERROR FULL:", error);
      // console.log("UPDATE ERROR DATA:", error.response?.data);
      dispatch(
        setItemError(
          error.response?.data?.message || "Failed to fetch user data",
        ),
      );
    } finally {
      setItemLoading(false);
    }
  }

  async function handleDeleteItemById(id) {
    try {
      setItemLoading(true);
      await deleteItemById(id);
    } catch (error) {
      dispatch(
        setItemError(
          error.response?.data?.message || "Failed to fetch user data",
        ),
      );
    } finally {
      setItemLoading(false);
    }
  }

  async function handleRealtedItemsById(id) {
    try {
      setItemLoading(true);
      const data = await getRelatedItemsController(id);
      dispatch(addRelatedItems(data));
    } catch (error) {
      dispatch(
        setItemError(
          error.response?.data?.message || "Failed to fetch user data",
        ),
      );
    } finally {
      setItemLoading(false);
    }
  }

  return {
    handleGetItems,
    handleCreateItem,
    handleGetItemById,
    handleUpdateItemById,
    handleDeleteItemById,
    handleRealtedItemsById,
  };
}
