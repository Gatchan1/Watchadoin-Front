import { Routes, Route } from "react-router-dom";
import { authContext } from "./contexts/auth.context";
import { useContext } from "react";
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
  const { loading, isLoggedIn } = useContext(authContext);

  return (
    <>
        <Routes>
          <Route path="/" element={(!loading && isLoggedIn) ? <DashboardPage /> : <SignUpPage />} />
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/:username" element={(!loading && isLoggedIn) ? <ProfilePage /> : <SignUpPage />} />
          <Route path="/:username/edit" element={(!loading && isLoggedIn) ? <EditProfilePage /> : <SignUpPage />} />
          <Route path="/events/:eventId" element={(!loading && isLoggedIn) ? <EventDetailPage /> : <SignUpPage />} />
          <Route path="/404" element={<ErrorPage />} />
          <Route path="/*" element={(!loading && isLoggedIn) ? <ErrorPage /> : <SignUpPage />} />
        </Routes>
      <Footer />
    </>
  );
}

export default App;
