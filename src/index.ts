import { PORT } from "../config/env";
import { app } from "./app";
import { connectDatabase } from "./db";

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log("Server Started on PORT : " + PORT);
    });
  } catch (error) {
    console.error("Error : " + error);
  }
}

startServer();
