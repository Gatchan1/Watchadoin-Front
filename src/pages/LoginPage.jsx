import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import Alert from "../components/Alert";
import NavbarLoggedOut from "../components/NavbarLoggedOut";
// const baseUrl = "http://localhost:5005";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { isAuthenticated, isLoggedIn, loading, baseUrl } = useContext(authContext);

  const submitHandler = (e) => {
    e.preventDefault();

    //do submit things:

    if (username == "" || password == "") {
      console.log("error: fields missing");
      setError("error: fields missing");
      return;
    }
    axios
      .post(baseUrl + "/auth/login", { username, password })
      .then(({ data }) => {
        let jwt = data.authToken;
        localStorage.setItem("authToken", jwt);
        isAuthenticated();
      })
      .catch((err) => setError("Could not finish the process, try again"));
  };

  if (!loading && isLoggedIn) return <Navigate to="/" />;

  return (
    <>
      <NavbarLoggedOut />
      <div id="login">
        <h2>Log In</h2>
        <form onSubmit={submitHandler} className="signup-form container">
          {error != "" && <Alert message={error} setError={setError} />}
          <div className="row">
            <div className="col-3">
              <label htmlFor="username" className="form-label"> Username</label>
              <input id="username" className="form-control" type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="col-3">
              <label htmlFor="password" className="form-label"> Password</label>
              <input id="password" className="form-control" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <a className="forgot" href="/forgot-password">
              Forgot password?
            </a>
            {/* changeLater: this won't be an anchor */}
            <div className="col-3 auth">
              <button type="submit" className="login btn btn-primary">
                LOG IN
              </button>
            </div>
          </div>
          {/* changeLater: Need to implement error alert */}
        </form>
      </div>
    </>
  );
}
