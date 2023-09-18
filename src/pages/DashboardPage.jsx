import "../css/DashboardPage.css";
import "../../src/index.css"
import { authContext } from "../contexts/auth.context";
import { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import ConfirmedEvents from "../components/ConfirmedEvents";
import NewEvents from "../components/NewEvents";

export default function DashboardPage() {
  const { loading, user, getUserInfo, loadingPopulated } = useContext(authContext);

  useEffect(()=>{
    getUserInfo()
  },[loading])

  return (
    <>
      <Navbar />
      <header className="dashboard">
      {/* <img id="profile-picture" src={currentUser.picture} alt="profile picture"></img> */}
        <p className="welcome">Welcome, {user.username}! 👋</p>
      </header>
      <div className="dashboardComponents">
        <div className="row1">
          {!loadingPopulated && <ConfirmedEvents />}
        </div>
        <div className="row2">
        {!loadingPopulated && <NewEvents />}
        </div>
      </div>
    </>
  );
}
