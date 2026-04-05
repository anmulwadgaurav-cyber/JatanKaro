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

// SPA fallback: serve `public/index.html` for non-API GET requests.
// Use `app.use` middleware (no path pattern) to avoid path-to-regexp parsing issues
// that can happen on some platforms with wildcard route strings.
app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  if (req.path.startsWith("/api/")) return next();
  if (!req.accepts || !req.accepts("html")) return next();

  // If the request looks like a static asset (has a file extension),
  // skip the SPA fallback so static middleware can serve it or return 404.
  // This prevents returning index.html with text/html for asset requests
  // which breaks MIME-type checks in browsers.
  if (req.path.match(/\.[a-zA-Z0-9]+$/)) return next();

  const indexPath = path.resolve("./public/index.html");
  res.sendFile(indexPath, (err) => {
    if (err) return next();
  });
});

export default app;
