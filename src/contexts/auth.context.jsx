import PropTypes from 'prop-types';  
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const authContext = createContext();

const baseUrl = "https://watchadoin.fly.dev";
//"https://watchadoin.fly.dev" "http://localhost:5005"

function AuthProviderWrapper({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); //false
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); //true
  const [currentUser, setCurrentUser] = useState({});
  const [loadingPopulated, setLoadingPopulated] = useState(true);
  const [loadingRaw, setLoadingRaw] = useState(true);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [currentUserRaw, setCurrentUserRaw] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated();
  }, []);

  useEffect(() => {
    if (!user) return;
    getUserInfoRaw();
    getUserInfo();
  }, [loading]);

  useEffect(() => {
    if (!loadingRaw && !loadingPopulated) setLoadingUserInfo(false);
  }, [loadingRaw, loadingPopulated]);

  const getHeaders = () => {
    let token = localStorage.getItem("authToken");
    return { headers: { authorization: `Bearer ${token}` } };
  };

  const isAuthenticated = () => {
    // get a token:
    let token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get(baseUrl + "/auth/verify", { headers: { authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          setIsLoggedIn(true);
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          setIsLoggedIn(false);
          setUser(null);
          setLoading(false);
          navigate("/");
          console.log(err);
        });
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setLoading(false);
    }
  };

  // function for retrieving current user data (populated)!
  const getUserInfo = () => {
    if (loading) return;
    if (!user) return;
    else {
      axios
        .get(baseUrl + "/users/" + user.username, getHeaders())
        .then(({ data }) => {
          setCurrentUser(data);
          setLoadingPopulated(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // function for retrieving current user data, UNPOPULATED!
  const getUserInfoRaw = () => {
    if (loading) return;
    if (!user) return;
    else {
      setLoadingRaw(true);
      axios
        .get(baseUrl + "/users/" + user.username + "/raw", getHeaders())
        .then(({ data }) => {
          setCurrentUserRaw(data);
          setLoadingRaw(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  let exposedValues = {
    isLoggedIn,
    user,
    loading,
    baseUrl,
    isAuthenticated,
    getHeaders,
    getUserInfo,
    getUserInfoRaw,
    currentUser,
    currentUserRaw,
    loadingUserInfo,
    loadingRaw,
    loadingPopulated,
  };

  return <authContext.Provider value={exposedValues}>{children}</authContext.Provider>;
}

AuthProviderWrapper.propTypes = {
  children: PropTypes.any
}

export { authContext, AuthProviderWrapper };
