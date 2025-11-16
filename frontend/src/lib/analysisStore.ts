import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export interface AnalysisDoc {
  id: string;
  userId: string;
  title: string;
  relationshipType: string;
  rawText?: string;
  summaryText: string;
  overallVibe: string;
  vibeScore: number;
  insights: string[];
  suggestions: string[];
  createdAt?: number;
}

export async function createAnalysis(
  userId: string,
  data: {
    title: string;
    relationshipType: string;
    rawText?: string;
    summaryText: string;
    overallVibe: string;
    vibeScore: number;
    insights: string[];
    suggestions: string[];
  }
): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(collection(db, "analyses"), {
    userId,
    title: data.title,
    relationshipType: data.relationshipType,
    rawText: data.rawText ?? "",
    summaryText: data.summaryText,
    overallVibe: data.overallVibe,
    vibeScore: data.vibeScore,
    insights: data.insights,
    suggestions: data.suggestions,
    createdAt: now,
  });
  return ref.id;
}

export async function getAnalysesForUser(
  userId: string
): Promise<AnalysisDoc[]> {
  const q = query(
    collection(db, "analyses"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      ...data,
    } as AnalysisDoc;
  });
}

export async function getAnalysisById(
  id: string
): Promise<AnalysisDoc | null> {
  const ref = doc(db, "analyses", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  return {
    id: snap.id,
    ...data,
  } as AnalysisDoc;
}
