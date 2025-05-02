import e from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path";

import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config()
const PORT = process.env.PORT;
const __dirname = path.resolve();

// cors allows for requests from other origins which in this case is our frontend
// credentials : true allows for cookies to be accepted.
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
// express.json() allows us to parse json data coming from the request.
app.use(e.json());
// cookieParser() allows us to parse cookies from the request
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
    const pathToFrontend = path.join(__dirname, "../frontend", "dist");
    console.warn(">> ", pathToFrontend);
    app.use(e.static(pathToFrontend))

    // for some reason the "*" path is breaking the app only root "/" works
    app.get("/", (req, res) => {
        console.log("here 2")
        res.sendFile(path.join(pathToFrontend, "index.html"))
    })
}

server.listen(PORT, () => {
    console.log("listening on " + PORT)
    connectDB()
})