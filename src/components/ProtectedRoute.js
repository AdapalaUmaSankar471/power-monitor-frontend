import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  console.log("ProtectedRoute Debug:");
  console.log("Token:", token);
  console.log("UserRole:", userRole);
  console.log("RequiredRole:", role);

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;