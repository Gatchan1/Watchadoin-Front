import "../css/OwnProfile.css";
import { authContext } from "../contexts/auth.context";
import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import FriendsAccordion from "./FriendsAccordion";
import MyEvents from "./MyEvents";

export default function OwnProfile() {
  const { loading, getUserInfo, currentUser, loadingPopulated } = useContext(authContext);
  const { username } = useParams();
  const [loadingSpinner, setLoadingSpinner] = useState(true);

  // Retrieve current user data at mounting phase.
  useEffect(() => {
    getUserInfo();
    if (!loading)
      setTimeout(() => {
        setLoadingSpinner(false);
      }, 500);
  }, [loading]);

  return (
    <div id="OwnProfile">
    {loadingSpinner ? <div className="spinnerContainer">
          <span className="spinner" role="status"></span>
        </div> :
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
    }
    </div>
  );
}
