import dotenv from "dotenv";
import connectDB from "./db/index.js";
import server from "./app.js";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Listening on port http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed!!!", error);
  });
