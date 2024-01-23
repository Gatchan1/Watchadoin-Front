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
  const [displayResults, setDisplayResults] = useState(false);
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
    <nav className="navbar navbar-expand-md logged-in">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/logo.png" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="menu">
            <div className="search-form">
              <form className="d-flex">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search users"
                  aria-label="Search"
                  value={text}
                  onFocus={() => {
                    setDisplayResults(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setDisplayResults(false), 200);
                  }}
                  onChange={(e) => setText(e.target.value)}
                />
              </form>

              {searchResults.length > 0 && displayResults && (
                <ul className="search-dropdown" aria-label="search dropdown">
                  {searchResults.map((searchUser) => (
                    <li className="dropdown-item" key={searchUser._id}>
                      <div className="friend-icon-container-row">
                        <div>
                          <img className="friend-icon" src={searchUser.picture} alt={searchUser.username} />
                        </div>
                        <Link className="link-styled" to={`/${searchUser.username}`}>
                          {searchUser.username}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <ul className="navbar-nav">
              <li className="nav-item sign-out">
                <Link className="nav-link active" aria-current="page" to="/logout">
                  Sign out <span>({username})</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
