import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { analyzeRouter } from "./routes/analyze";

config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/analyze", analyzeRouter);

app.listen(port, () => {
  console.log(`AuraAI server listening on port ${port}`);
});
