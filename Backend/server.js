import "./dns.js"
import "dotenv/config";
import app from "./src/app.js";
import connectToMongoDB from "./src/config/database.js";

connectToMongoDB()

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running of port: ", PORT);
});
