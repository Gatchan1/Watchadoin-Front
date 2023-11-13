import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function PublicProfile() {
  const { baseUrl, user, getHeaders, currentUserRaw, getUserInfoRaw, loadingRaw } = useContext(authContext);
  const { username } = useParams();

  const [publicUserRaw, setPublicUserRaw] = useState({});
  const [loadingPublicUser, setLoadingPublicUser] = useState(true);
  const [friendshipStatus, setFriendshipStatus] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(true);

  function getPublicUserDataRaw() {
    axios
      .get(baseUrl + "/users/" + username + "/raw", getHeaders())
      .then(({ data }) => {
        setPublicUserRaw(data);
        setLoadingPublicUser(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getPublicUserDataRaw();
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

    if (!currentUserRaw.friendsPending.includes(publicUserRaw._id) && !publicUserRaw.friendsPending.includes(currentUserRaw._id) && !currentUserRaw.friendsConfirmed.includes(publicUserRaw._id)) setFriendshipStatus("TOSEND");
    else if (currentUserRaw.friendsPending.includes(publicUserRaw._id)) setFriendshipStatus("TOACCEPT");
    else if (publicUserRaw.friendsPending.includes(currentUserRaw._id)) setFriendshipStatus("REQUESTED");
    else if (currentUserRaw.friendsConfirmed.includes(publicUserRaw._id)) setFriendshipStatus("TOREVOKE");
  }, [currentUserRaw, publicUserRaw]);

  function addFriend() {
    axios
      .post(baseUrl + "/friendstatus/" + publicUserRaw._id + "/sendrequest", {}, getHeaders())
      .then(() => {
        getPublicUserDataRaw();
      })
      .catch((err) => {
        console.log(err);
        // set error message alarm?
      });
  }

  function removeFriend() {
    axios
      .post(baseUrl + "/friendstatus/" + publicUserRaw._id + "/remove", {}, getHeaders())
      .then(() => {
        getPublicUserDataRaw();
        getUserInfoRaw();
      })
      .catch((err) => {
        console.log(err);
        // set error message alarm?
      });
  }

  function acceptFriend() {
    axios
      .post(baseUrl + "/friendstatus/" + publicUserRaw._id + "/" + "accept", {}, getHeaders())
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
            Public profile page of {username} {!loadingPublicUser && <img className="publicAvatar" src={publicUserRaw.picture} />}
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
            Go back to your profile
          </Link>
        </>
      )}
    </div>
  );
}
