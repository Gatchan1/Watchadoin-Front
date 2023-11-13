import "../css/OwnProfile.css";
import { authContext } from "../contexts/auth.context";
import { useParams, Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import FriendsAccordion from "./FriendsAccordion";
import MyEvents from "./MyEvents";

export default function OwnProfile() {
  const { username } = useParams();
  const { loading, getUserInfo, currentUser, loadingPopulated } = useContext(authContext);

  // Retrieve current user data at mounting phase.
  useEffect(() => {
    getUserInfo();
  }, [loading]);

  return (
    <div id="OwnProfile">
      <div className="own-profile">
        <div className="first-section">
          <div className="edit-profile">
            <img src={currentUser.picture} className="big-size-avatar" />
            <Link to={`/${username}/edit`}>Change profile picture</Link>
          </div>

          {!loadingPopulated && <FriendsAccordion />}
        </div>
        <hr />
        {!loadingPopulated && <MyEvents />}
      </div>
    </div>
  );
}
