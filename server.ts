import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { generateReply } from "./llm";





import { router } from "./routes";

dotenv.config();

generateReply([], "Say hello")
    .then(console.log)
    .catch(console.error);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(process.env.PORT, () => {
    console.log("Backend running on port", process.env.PORT);
});
