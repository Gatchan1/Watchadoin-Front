import { authContext } from "../contexts/auth.context";
import { useContext, useState } from "react";
import axios from "axios";
import CreateInviteList from "./CreateInviteList";
import AlertDeleteList from "./AlertDeleteList";
import { Link } from "react-router-dom";

export default function InviteList() {
  const { currentUser, baseUrl, getHeaders, checkUser } = useContext(authContext);

  const [showCreateList, setShowCreateList] = useState(false);
  const [IdToDelete, setIdToDelete] = useState("");

  function toggleCreateList() {
    showCreateList ? setShowCreateList(false) : setShowCreateList(true);
  }

  const askDeleteList = (list) => {
    setIdToDelete(list._id)
  };

  return (
    <div id="InviteList">
      <button
        className="btn btn-outline-primary show-create-list"
        onClick={(e) => {
          e.preventDefault();
          toggleCreateList();
        }}
      >
        {!showCreateList ? <img style={{ width: "20px" }} src="plus.png" alt="create event" /> : <img style={{ width: "20px" }} src="minus.png" alt="roll up create event" />}
      </button>
      {showCreateList && <CreateInviteList />}
      {showCreateList && <hr />}
      {currentUser.inviteLists[0] ? (
        <div className="lists">
          {currentUser.inviteLists.map((list) => {
            return (
              <div className="list" key={list._id}>
              { IdToDelete === list._id && <AlertDeleteList list={list} setIdToDelete={setIdToDelete}/>}
                <div className="heading">
                  <h5>{list.title}</h5>
                  <button
                    className="delete"
                    onClick={(e) => {
                      e.preventDefault();
                      askDeleteList(list);
                    }}
                  >
                    ❌
                  </button>
                </div>
                <div className="row-of-friends">
                  {list.users.map((user) => {
                    return (
                      <div className="friend-icon-container" key={user._id}>
                        <img className="friend-icon" src={user.picture} alt={user.username} />
                        <Link className="link-styled" onClick={() => checkUser(user.username)} to={`/${user.username}`}>
                          {user.username}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No Friend Circles to show</p>
      )}
    </div>
  );
}
