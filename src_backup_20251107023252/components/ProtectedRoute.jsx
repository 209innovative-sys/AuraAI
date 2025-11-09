import { Navigate } from "react-router-dom";
import { firebaseAuth } from "../firebase-config";

export default function ProtectedRoute({ children }) {
  const user = firebaseAuth.currentUser;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}
