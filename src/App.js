import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthPage from "./pages/AuthPage";

import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import ViewerDashboard from "./pages/ViewerDashboard";
import EnergyDashboard from "./pages/EnergyDashboard";

import Devices from "./pages/Devices";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Alerts from "./pages/Alerts";
import ActivityLogs from "./pages/ActivityLogs";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* ADMIN */}
        <Route path="/admin" element={
          <ProtectedRoute role="ADMIN">
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/devices" element={
          <ProtectedRoute roles={["ADMIN","USER"]}>
            <DashboardLayout><Devices /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute roles={["ADMIN","USER"]}>
            <DashboardLayout><Reports /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute role="ADMIN">
            <DashboardLayout><Users /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/logs" element={
          <ProtectedRoute role="ADMIN">
            <DashboardLayout><ActivityLogs /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/alerts" element={
          <ProtectedRoute role="ADMIN">
            <DashboardLayout><Alerts /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/energy" element={
          <ProtectedRoute roles={["ADMIN","USER"]}>
            <DashboardLayout><EnergyDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* ANY ROLE */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout><Profile /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardLayout><Settings /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* OPERATOR */}
        <Route path="/operator" element={
          <ProtectedRoute role="OPERATOR">
            <DashboardLayout><OperatorDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* VIEWER */}
        <Route path="/viewer" element={
          <ProtectedRoute role="VIEWER">
            <DashboardLayout><ViewerDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* USER ✅ UPDATED */}
        <Route path="/user" element={
          <ProtectedRoute role="USER">
            <DashboardLayout>
              <ViewerDashboard />   {/* 🔥 SAME AS VIEWER */}
            </DashboardLayout>
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;