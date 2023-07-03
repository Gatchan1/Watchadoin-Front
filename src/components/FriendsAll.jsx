import { Link } from "react-router-dom";
import { authContext } from "../contexts/auth.context";
import { useContext, useEffect, useState } from "react";

export default function FriendsAll() {
  const { loadingUserInfo, user, currentUser, baseUrl, getHeaders, getUserInfo } = useContext(authContext);

  return (
    <div id="FriendsAll" >
      {currentUser.friendsConfirmed[0] ?
        currentUser.friendsConfirmed.map((friend) => {
          return (
            <div className="friend" key={friend._id}>
              <img className="friend-icon" src={friend.picture} alt={friend.username} />
              <Link className="friend-user" onClick={() => {window.location.href=`/${friend.username}`}}> {friend.username} </Link>
            </div>
          );
        }) : "No friends confirmed yet"}
    </div>
  );
}
