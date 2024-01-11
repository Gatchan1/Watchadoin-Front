import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { Link } from "react-router-dom";
import { useContext } from "react";

export default function FriendsPending() {
  const { currentUser, baseUrl, getHeaders, getUserInfo, checkUser } = useContext(authContext);

  function acceptFriend(friendId) {
    axios
      .post(baseUrl + "/friendstatus/" + friendId + "/" + "accept", {}, getHeaders())
      .then(() => {
        getUserInfo();
      })
      .catch((err) => console.log(err));
  }

  function rejectFriend(friendId) {
    axios
      .post(baseUrl + "/friendstatus/" + friendId + "/" + "reject", {}, getHeaders())
      .then(() => {
        getUserInfo();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div id="FriendsPending">
      {currentUser.friendsPending.map((friendRequest, index) => {
        let bgColor;
        if (index % 2 !== 0) bgColor = "colored";
        return (
          <div key={friendRequest._id}>
            <div className={"row-flex " + (bgColor ? bgColor : "")}>
              <div className="img-container">
                <img src={friendRequest.picture} alt={friendRequest.username} />
              </div>
              <Link className="link-styled" aria-current="page" onClick={() => checkUser(friendRequest.username)} to={`/${friendRequest.username}`}>
                {friendRequest.username}
              </Link>
              <div className="noWrap">
                <button onClick={() => acceptFriend(friendRequest._id)} type="submit" className="btn btn-success friendReq">
                  Accept
                </button>
                <button onClick={() => rejectFriend(friendRequest._id)} type="submit" className="btn btn-warning friendReq">
                  Reject
                </button>
              </div>
            </div>
          </div>
        );
      })}
      {!currentUser.friendsPending[0] && <p>You have no new friendship requests</p>}
    </div>
  );
}
