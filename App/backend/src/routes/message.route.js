import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSideBar, sendMessage } from "../controllers/message.controller.js";

const route = Router();

route.get("/users",protectRoute, getUsersForSideBar);
route.get("/:id", protectRoute, getMessages);
route.post("/send/:id", protectRoute, sendMessage)

export default route;