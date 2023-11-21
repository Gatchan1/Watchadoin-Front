import { Link } from "react-router-dom";
import { authContext } from "../contexts/auth.context";
import { useContext } from "react";

export default function FriendsConfirmed() {
  const { currentUser, checkUser } = useContext(authContext);

  return (
    <div id="FriendsConfirmed" className="row-of-friends">
      {currentUser.friendsConfirmed[0]
        ? currentUser.friendsConfirmed.map((friend) => {
            return (
              <div className="friend-icon-container" key={friend._id}>
                <img className="friend-icon" src={friend.picture} alt={friend.username} />
                <Link className="link-styled" onClick={() => checkUser(friend.username)} to={`/${friend.username}`}>
                  {friend.username}
                </Link>
              </div>
            );
          })
        : <p>No friends confirmed yet</p>}
    </div>
  );
}
