import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import routes from "./routes";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.listen(8000, async () => {
  console.log(`Server running onport 8000`);
  try {
    await createConnection();
    app.use("/api", routes);
    console.log(`Database connected`);
  } catch (err) {
    console.log(err);
  }
});
