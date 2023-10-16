import axios from "axios";
import { authContext } from "../../contexts/auth.context";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OwnProfilePage from "./OwnProfilePage";
import PublicProfilePage from "./PublicProfilePage";
import "../../css/PublicProfile.css";
import Footer from "../../components/Footer";

export default function ProfilePage() {
  const { user, baseUrl, loading, getHeaders } = useContext(authContext);
  // console.log("useeer:",user)
  const { username } = useParams();
  // console.log("username: ", username)
  const navigate = useNavigate();

  const [publicUserData, setPublicUserData] = useState({});
  const [profile, setProfile] = useState("");

  useEffect(() => {
    setProfile("");
  }, []);

  useEffect(() => {
    if (loading) return;
    if (username != user.username) {
      // Check if the username profile route we are trying to access belongs to a real user or should redirect to an error page.
      axios
        .get(baseUrl + "/users/" + username, getHeaders())
        .then(({ data }) => {
          console.log("response: ", data);
          setPublicUserData(data);
          setProfile("public");
        })
        .catch((err) => {
          console.log(err);
          navigate("/404");
        });
    } else setProfile("own");
    // console.log("params: ", params)
  }, [loading]);

  return (
    <div>
      <div className="anti-footer">
        {!loading && profile == "own" && (
          <div>
            <OwnProfilePage />
          </div>
        )}

        {!loading && profile == "public" && publicUserData.username && (
          <div>
            <PublicProfilePage publicUserData={publicUserData} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
