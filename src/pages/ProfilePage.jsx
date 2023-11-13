import { authContext } from "../contexts/auth.context";
import { useContext, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import "../css/PublicProfile.css";
import OwnProfile from "../components/OwnProfile";
import PublicProfile from "../components/PublicProfile";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const { user, loading, checkUser, publicUserData, loadingCheckUser } = useContext(authContext);
  const { username } = useParams();

  useEffect(() => {
    if (loading) return;
    if (username != user.username) checkUser(username);
    // Check if the username profile route we are trying to access 
    // belongs to a real user or should redirect to an error page.
  }, [loading]);

  return (
      <div className="anti-footer">
      <Navbar />
        {!loading && username == user.username && (
          <div>
            <OwnProfile />
          </div>
        )}

        {!loading && username != user.username && publicUserData && (
          <div>
            <PublicProfile />
          </div>
        )}

        {!loadingCheckUser && !publicUserData && <Navigate to="/404" />}
      </div>
  );
}
