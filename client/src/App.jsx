import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/homePage";
import Register from "./pages/registerPage";
import Login from "./pages/loginPage";
import Header from "./components/header";
import ProtectedRoute from "./components/ProtectedRoute";

import UserDashboard from "./pages/User/UserDashboard";
import AgentDashboard from "./pages/Agent/AgentDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddArticle from "./pages/Admin/AddArticle";
import CreateTicket from "./pages/User/CreateTicket";
import NotFound from "./pages/notFound";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <Header />{" "}
      <Routes>
        {" "}
        <Route path="/" element={<Navigate to="/home" />} />{" "}
        <Route path="/register" element={<Register />} />{" "}
        <Route path="/login" element={<Login />} />{" "}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              {" "}
              <UserDashboard />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/user/create-ticket"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              {" "}
              <CreateTicket />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute allowedRoles={["agent"]}>
              {" "}
              <AgentDashboard />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/add-article"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {" "}
              <AddArticle />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {" "}
              <AdminDashboard />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route path="/home" element={<Home />} />{" "}
        <Route path="*" element={<NotFound />} />{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}

export default App;
