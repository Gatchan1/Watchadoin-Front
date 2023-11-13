import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import ErrorPage from "./pages/ErrorPage";
import EventDetailPage from "./pages/EventDetailPage";
import Footer from "./components/Footer";
import "./app.css";

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/:username/edit" element={<EditProfilePage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/404" element={<ErrorPage />} />
        </Routes>
      <Footer />
    </>
  );
}

export default App;
