import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;