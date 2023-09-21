import { Routes, Route } from "react-router-dom";
import { authContext } from './contexts/auth.context';
import { useContext } from "react";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import DashboardPage from "./pages/DashboardPage";
import TempProfilePage from "./pages/profilePages/TempProfilePage";
import ProfilePage from "./pages/profilePages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import ErrorPage from "./pages/ErrorPage";
import EventDetailPage from "./pages/EventDetailPage";

function App() {

  const {isLoggedIn} = useContext(authContext);

  return (
    <>
      <Routes>
        <Route path="/" element={isLoggedIn ? <DashboardPage/> : <SignUpPage/>} />
        <Route path="/home" element={isLoggedIn ? <DashboardPage/> : <SignUpPage/>} />
        <Route path="/signup" element={isLoggedIn ? <DashboardPage/> : <SignUpPage/>} />
        <Route path="/login" element={isLoggedIn ? <DashboardPage/> : <LoginPage/>} />
        <Route path="/logout" element={<LogoutPage/>} />
        <Route path="/profile/:username" element={isLoggedIn ? <TempProfilePage/> : <SignUpPage/>} />
        <Route path="/:username" element={isLoggedIn ? <ProfilePage/> : <SignUpPage/>} />
        <Route path="/:username/edit" element={isLoggedIn ? <EditProfilePage/> : <SignUpPage/>} />
        <Route path="/events/:eventId" element={isLoggedIn ? <EventDetailPage/> : <SignUpPage/>} />
        <Route path="/404" element={<ErrorPage/>} />
        <Route path="/*" element={isLoggedIn ? <ErrorPage/> : <SignUpPage/>} />
      </Routes>      
    </>
  )
}

export default App
