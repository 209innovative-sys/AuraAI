import * as functions from "firebase-functions";
import { withCors } from "./util/corsUtil";
import { analyzeText } from "./openaiClient";

export const analyze = functions.https.onRequest(
  withCors(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    let body: any = {};
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch (_) {
      // ignore, handled below
    }

    const input = body?.input;
    if (!input || typeof input !== "string") {
      res.status(400).send("Missing 'input' string in JSON body");
      return;
    }

    const output = await analyzeText(input);
    res.json({ output });
  })
);
