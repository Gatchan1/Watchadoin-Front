import { Link } from "react-router-dom";
import { authContext } from "../contexts/auth.context";
import { useContext, useEffect, useState } from "react";

export default function FriendsOverview() {
  const { loadingUserInfo, user, currentUser, baseUrl, getHeaders, getUserInfo } = useContext(authContext);

  const [fewFriends, setFewFriends] = useState([]);

  useEffect(() => {
    if (!loadingUserInfo) {
      setFewFriends(currentUser.friendsConfirmed.slice(0,6));
    }
  }, [loadingUserInfo]);



  return (
    <div id="FriendsOverview">
      {!loadingUserInfo &&
        fewFriends.map((friend) => {
          return (
            <div className="few-friends" key={friend._id}>
              <img className="friend-icon" src={friend.picture} alt={friend.username} />
              <Link onClick={() => {window.location.href=`/${friend.username}`}}> {friend.username} </Link>
            </div>
          );
        })}
    </div>
  );
}
