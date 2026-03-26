import Router from "express";
import {
  createItemController,
  deleteItemController,
  getItemByIdController,
  getItemsController,
  getRelatedItemsController,
  semanticSearchController,
  updateItemController,
} from "../controllers/item.controller.js";
import { identifyUserMiddleware } from "../middlewares/auth.middleware.js";
import { createItemValidator } from "../validators/items.validator.js";

const itemRouter = Router();

/*
@route POST /api/items/create-item
@desc Create a new item
@access Private
*/
itemRouter.post(
  "/create-item",
  identifyUserMiddleware,
  createItemValidator,
  createItemController,
);

/*
@route POST /api/items/semantic-search
@desc Perform semantic search on items
@access Private
*/
itemRouter.get(
  "/semantic-search",
  identifyUserMiddleware,
  semanticSearchController,
);

/*
@route GET /api/items/related/:itemId
@desc Get related items based on embedding similarity
@access Private
*/
itemRouter.get("/related/:itemId", identifyUserMiddleware, getRelatedItemsController);

/*
@route GET /api/items/get-items
@desc Get all items for the authenticated user
@access Private
*/
itemRouter.get("/get-items", identifyUserMiddleware, getItemsController);

/*
@route GET /api/items/get-item/:id
@desc Get a specific item for the authenticated user
@access Private
*/
itemRouter.get("/get-item/:id", identifyUserMiddleware, getItemByIdController);

/*
@route DELETE /api/items/:id
@desc Delete an item for the authenticated user
@access Private
*/
itemRouter.delete(
  "/delete-item/:id",
  identifyUserMiddleware,
  deleteItemController,
);

/*
@route PATCH /api/items/update-item/:id
@desc Update an item for the authenticated user
@access Private
*/
itemRouter.patch(
  "/update-item/:id",
  identifyUserMiddleware,
  updateItemController,
);

export default itemRouter;
