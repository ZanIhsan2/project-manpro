import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import { Footer } from "./components/shared.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Events from "./pages/Events.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import EventRegister from "./pages/EventRegister.jsx";
import MyRegistrations from "./pages/MyRegistrations.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";
import Feedback from "./pages/Feedback.jsx";
import About from "./pages/About.jsx";
import Admin from "./pages/Admin.jsx";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function Protected({ children, admin }) {
  const { user, ready, isAdmin } = useAuth();
  const loc = useLocation();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (admin && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

function Shell({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 66px)" }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        {/* halaman auth tanpa navbar/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Shell><Home /></Shell>} />
        <Route path="/events" element={<Shell><Events /></Shell>} />
        <Route path="/events/:id" element={<Shell><EventDetail /></Shell>} />
        <Route path="/about" element={<Shell><About /></Shell>} />

        <Route path="/events/:id/register" element={<Shell><Protected><EventRegister /></Protected></Shell>} />
        <Route path="/events/:id/feedback" element={<Shell><Protected><Feedback /></Protected></Shell>} />
        <Route path="/registrations" element={<Shell><Protected><MyRegistrations /></Protected></Shell>} />
        <Route path="/bookmarks" element={<Shell><Protected><Bookmarks /></Protected></Shell>} />
        <Route path="/admin" element={<Shell><Protected admin><Admin /></Protected></Shell>} />

        <Route path="*" element={<Shell><Home /></Shell>} />
      </Routes>
    </>
  );
}
