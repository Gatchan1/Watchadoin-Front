import { Link } from "react-router-dom";
import { authContext } from "../contexts/auth.context";
import { useContext } from "react";

export default function FriendsAll() {
  const { currentUser } = useContext(authContext);

  return (
    <div id="FriendsAll" className="row-of-friends" >
      {currentUser.friendsConfirmed[0] ?
        currentUser.friendsConfirmed.map((friend) => {
          return (
            <div className="friend-icon-container" key={friend._id}>
              <img className="friend-icon" src={friend.picture} alt={friend.username} />
              <Link className="link-styled" to={`/profile/${friend.username}`}> {friend.username} </Link>
            </div>
          );
        }) : "No friends confirmed yet"}
    </div>
  );
}
