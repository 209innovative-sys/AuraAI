import * as functions from "firebase-functions";
import * as corsLib from "cors";

const allowed = new Set<string>([
  "https://auraai-live-2309dqam1-phillips-projects-8e47c9d9.vercel.app",
  "http://localhost:5173"
]);

export function withCors(handler: (req: functions.https.Request, res: functions.Response) => Promise<void> | void) {
  const cors = corsLib({ 
    origin(origin, cb) {
      if (!origin) return cb(null, true); // allow curl/postman
      if (allowed.has(origin)) return cb(null, true);
      return cb(new Error(\Origin not allowed: \\), false);
    },
    credentials: true
  });

  return (req: functions.https.Request, res: functions.Response) => {
    const origin = (req.headers.origin || "") as string;
    if (origin && allowed.has(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
      res.set("Vary", "Origin");
      res.set("Access-Control-Allow-Credentials", "true");
      res.set("Access-Control-Allow-Headers", "Authorization,Content-Type");
      res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    }

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    cors(req, res, () => {
      Promise.resolve(handler(req, res)).catch((err) => {
        console.error("Handler error:", err);
        if (!res.headersSent) {
          res.status(400).send(typeof err?.message === "string" ? err.message : "Error");
        }
      });
    });
  };
}
