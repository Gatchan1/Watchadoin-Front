import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "../css/PublicProfile.css";
import "../App.css";
import OwnProfile from "../components/OwnProfile";
import PublicProfile from "../components/PublicProfile";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const { user, loading, isLoggedIn, baseUrl, getHeaders} = useContext(authContext);
  const navigate = useNavigate();
  const { username } = useParams();
  
  const [loadingPublicUser, setLoadingPublicUser] = useState(true);
  const [publicUserData, setPublicUserData] = useState({});

  function getPublicUserData(name) {
    axios
      .get(baseUrl + "/users/" +  name + "/raw", getHeaders())
      .then(({ data }) => {
        setPublicUserData(data);
        setLoadingPublicUser(false);
      })
      .catch((err) => {
        console.log(err);
        navigate("/404");
      });
  }

  useEffect(() => {
    setLoadingPublicUser(true);
    if (loading) return;
    if (!loading && !isLoggedIn) navigate("/signup");
    else if (!loading && username != user.username ) {
      getPublicUserData(username)}
    // Check if the username profile route we are trying to access
    // belongs to a real user or should redirect to an error page.
  }, [loading, username]);

  if (!loading && !isLoggedIn) return <Navigate to="/signup" />;

  return (
    <div className="anti-footer">
      {!loading && <Navbar />}
      {!loading && username == user.username && (
        <div>
          <OwnProfile />
        </div>
      )}

      {!loadingPublicUser && username != user.username && publicUserData && (
        <div>
          <PublicProfile userData={publicUserData} getPublicUserData={getPublicUserData} loadingPublicUser={loadingPublicUser}/>
        </div>
      )}

      {!loadingPublicUser && username != user.username && !publicUserData && <Navigate to="/404" />}
    </div>
  );
}
