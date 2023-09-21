import { Link } from "react-router-dom";
import { authContext } from "../contexts/auth.context";
import { useEffect, useState, useContext } from "react";
import "../css/Navbar.css";
import axios from "axios";

export default function Navbar() {
  const { user, baseUrl, loading, currentUser, getHeaders } = useContext(authContext);
  const { username } = user;

  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [text, setText] = useState("");

  //Get all users from database
  useEffect(() => {
    {
      axios
        .get(baseUrl + "/users/all", getHeaders())
        .then(({ data }) => {
          setAllUsers(
            data.filter((foundUser) => {
              return foundUser.username != currentUser.username;
            })
          );
        })
        .catch((err) => console.log(err));
    }
  }, [loading]);

  //Filter for search bar
  const formOnChangeHandle = (text) => {
    // Without this "if" when we delete a search it would list a complete list of all our friends.
    if (text == "") {
      setSearchResults([]);
      return;
    }
    let searchFilter = allUsers.filter((foundUser) => {
      return foundUser.username.toLowerCase().includes(text.toLowerCase());
    });
    setSearchResults(searchFilter);
  };

  useEffect(() => {
    formOnChangeHandle(text);
  }, [text]);

  return (
    <nav className="navbar navbar-expand-lg logged-in">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/logo.png" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to={`/profile/${username}`}>
                Profile
              </Link>
            </li>
            <li>
              <Link className="nav-link active" aria-current="page" to="/logout">
                Sign out
              </Link>
            </li>
            {/* <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  More</Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="link" to="/notifications">Notifications</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/logout">Sign out</Link>
                  </li>
                </ul>
              </li> */}
          </ul>
          <div className="search-form">
            <form className="d-flex">
              <input className="form-control me-2" type="search" placeholder="Search users" aria-label="Search" value={text} onChange={(e) => setText(e.target.value)} />
            </form>

            {searchResults.length === 0 || (searchResults.length === allUsers.length && "")}
            {searchResults.length > 0 && (
              <ul className="search-dropdown" aria-label="search dropdown">
                {searchResults.map((searchUser) => (
                  <li className="dropdown-item" key={searchUser._id}>
                    <span className="friend-icon-container">
                      <img className="friend-icon" src={searchUser.picture} alt={searchUser.username} />
                    </span>
                    <Link className="link-styled" to={`/profile/${searchUser.username}`}>
                      {searchUser.username}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
