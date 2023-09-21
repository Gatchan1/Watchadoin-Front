import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { Link } from "react-router-dom";
import { useContext } from "react";

export default function FriendsPending() {
  const { currentUser, baseUrl, getHeaders, getUserInfo } = useContext(authContext);

  function acceptFriend(friendId) {
    axios
      .post(baseUrl + "/friendstatus/" + friendId + "/" + "accept", {}, getHeaders())
      .then(() => {
        getUserInfo();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div id="FriendsPending">
      {currentUser.friendsPending.map((friendRequest) => {
        return (
          <div key={friendRequest._id}>
            <div className="row-flex">
              <div className="img-container">
                <img src={friendRequest.picture} alt={friendRequest.username} />
              </div>
              <Link className="link-styled" aria-current="page" to={`/profile/${friendRequest.username}`}>
              {friendRequest.username}
              </Link>
              <button onClick={() => acceptFriend(friendRequest._id)} type="submit" className="btn btn-success">
                Accept
              </button>
            </div>
          </div>
        );
      })}
      {!currentUser.friendsPending[0] && <p>You have no new friendship requests</p>}
    </div>
  );
}
