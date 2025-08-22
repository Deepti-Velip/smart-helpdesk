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
import Settings from "./pages/Admin/Settings";
import Ticket from "./pages/Ticket";
import Audit from "./pages/Audit";
import TicketDetails from "./pages/ticketDetails";
import ArticleList from "./pages/Admin/ArticlesList";
import Suggestion from "./pages/User/Suggestions";

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
          path="user/suggestion/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              {" "}
              <Suggestion />{" "}
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/admin/articles"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {" "}
              <ArticleList />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {" "}
              <Settings />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/admin/tickets"
          element={
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
              {" "}
              <Ticket />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/audit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
              {" "}
              <Audit />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket-details/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
              {" "}
              <TicketDetails />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={<Home />} />{" "}
        <Route path="*" element={<NotFound />} />{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}

export default App;
