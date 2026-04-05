import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";
import authRouter from "./routes/auth.routes.js";
import itemRouter from "./routes/item.routes.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "chrome-extension://njhfpjjheajcgamnfglakggilnnodpaj",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies to be sent with requests
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//deployment
app.use(express.static("./public")); // Serve static files from the public directory (optional)

// health check
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Serve SPA entry for client-side routing when building frontend into Backend/public
// NOTE: SPA fallback moved below API routes to avoid catching API requests.

//Routes
app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);

// Serve SPA entry for client-side routing when building frontend into Backend/public
app.get("/*", (req, res) => {
  // If the request is for an API route, skip the SPA fallback
  if (req.path.startsWith("/api/"))
    return res.status(404).json({ error: "Not Found" });
  try {
    const indexPath = path.resolve("./public/index.html");
    return res.sendFile(indexPath);
  } catch (err) {
    return res.status(404).send("Not Found");
  }
});

export default app;
