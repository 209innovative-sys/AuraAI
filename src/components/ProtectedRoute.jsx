import { Navigate } from "react-router-dom";
import { firebaseAuth } from "../firebase/firebase";

export default function ProtectedRoute({ children }) {
  const user = firebaseAuth.currentUser;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}
