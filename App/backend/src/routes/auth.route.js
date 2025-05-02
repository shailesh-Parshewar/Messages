import { Router } from "express";
import { checkAuth, logIn, logOut, signUp, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const route = Router();

route.post("/signup", signUp);
route.post("/login", logIn);
route.post("/logout", logOut);
route.put("/update-profile", protectRoute, updateProfile);
route.get("/check", protectRoute, checkAuth)

export default route;


