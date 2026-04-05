import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import itemRouter from "./routes/item.routes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "chrome-extension://njhfpjjheajcgamnfglakggilnnodpaj",
    ], // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//deployment
app.use(express.static("./public")); // Serve static files from the public directory, matlab ki agar frontend build files ko serve karna hai to public folder me rakhna hoga

//Routes
app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);

export default app;
