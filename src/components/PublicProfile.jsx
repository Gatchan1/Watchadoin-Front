import PropTypes from 'prop-types';  
import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function PublicProfile({userData, getPublicUserData, loadingPublicUser}) {
  const { baseUrl, user, getHeaders, currentUserRaw, getUserInfoRaw, loadingRaw } = useContext(authContext);
  const { username } = useParams();

  const [friendshipStatus, setFriendshipStatus] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(true);

  useEffect(() => {
    getUserInfoRaw();
  }, []);

  useEffect(() => {
    if (!loadingPublicUser)
      setTimeout(() => {
        setLoadingSpinner(false);
      }, 500);
  }, [loadingPublicUser]);

  useEffect(() => {
    if (loadingRaw) return;
    if (loadingPublicUser) return;

    if (!currentUserRaw.friendsPending.includes(userData._id) && !userData.friendsPending.includes(currentUserRaw._id) && !currentUserRaw.friendsConfirmed.includes(userData._id)) setFriendshipStatus("TOSEND");
    else if (currentUserRaw.friendsPending.includes(userData._id)) setFriendshipStatus("TOACCEPT");
    else if (userData.friendsPending.includes(currentUserRaw._id)) setFriendshipStatus("REQUESTED");
    else if (currentUserRaw.friendsConfirmed.includes(userData._id)) setFriendshipStatus("TOREVOKE");
  }, [currentUserRaw, userData, loadingPublicUser]);

  function addFriend() {
    axios
      .post(baseUrl + "/friendstatus/" + userData._id + "/sendrequest", {}, getHeaders())
      .then(() => {
        getPublicUserData(username);
      })
      .catch((err) => {
        console.log(err);
        // set error message alarm?
      });
  }

  function removeFriend() {
    axios
      .post(baseUrl + "/friendstatus/" + userData._id + "/revoke", {}, getHeaders())
      .then(() => {
        getPublicUserData(username);
        getUserInfoRaw();
      })
      .catch((err) => {
        console.log(err);
        // set error message alarm?
      });
  }

  function acceptFriend() {
    axios
      .post(baseUrl + "/friendstatus/" + userData._id + "/" + "accept", {}, getHeaders())
      .then(() => {
        getUserInfoRaw();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div id="publicProfile">
      {loadingSpinner ? (
        <div className="spinnerContainer">
          <span className="spinner" role="status"></span>
        </div>
      ) : (
        <>
          <h4>
            Public profile page of {username} {!loadingPublicUser && <img className="publicAvatar" src={userData.picture} />}
          </h4>

          {!loadingPublicUser && friendshipStatus == "TOSEND" && (
            <button
              onClick={() => {
                addFriend();
              }}
              type="button"
              className="btn btn-primary"
            >
              Send friendship request
            </button>
          )}
          {!loadingPublicUser && friendshipStatus == "TOACCEPT" && (
            <button
              onClick={() => {
                acceptFriend();
              }}
              type="button"
              className="btn btn-success"
            >
              Accept friend request
            </button>
          )}
          {!loadingPublicUser && friendshipStatus == "REQUESTED" && (
            <button disabled className="btn btn-secondary">
              Friendship requested
            </button>
          )}
          {!loadingPublicUser && friendshipStatus == "TOREVOKE" && (
            <button
              onClick={() => {
                removeFriend();
              }}
              className="btn btn-warning"
            >
              Revoke friendship
            </button>
          )}
          <br />
          <Link className="link-styled" aria-current="page" to={`/${user.username}`}>
            Go back to your main hub
          </Link>
        </>
      )}
    </div>
  );
}

PublicProfile.propTypes = {
  userData: PropTypes.shape({
    _id: PropTypes.string,
    friendsPending: PropTypes.array,
    friendsConfirmed: PropTypes.array,
    picture: PropTypes.string,
  }),
  getPublicUserData: PropTypes.func,
  loadingPublicUser: PropTypes.bool
}