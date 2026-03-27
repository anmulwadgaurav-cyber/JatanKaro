import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/items",
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

export async function getItems({ q, type, tag, page, limit } = {}) {
  const response = await api.get("/get-items", {
    params: { q, type, tag, page, limit },
  });
  const semanticRes = await api.get("/semantic-search", {
    params: { q, type, tag, page, limit },
  });
  return { ...response.data, ...semanticRes.data.results };
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
