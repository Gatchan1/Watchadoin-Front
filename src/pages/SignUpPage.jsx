import "../css/auth.css";
import axios from "axios";
import { authContext } from "../contexts/auth.context";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Alert from "../components/Alert";
import NavbarLoggedOut from "../components/NavbarLoggedOut";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, loading, baseUrl } = useContext(authContext);

  const submitHandler = (e) => {
    e.preventDefault();

    //do submit things:

    if (username == "" || password == "" || passwordRepeat == "") {
      console.log("error: fields missing");
      setError("error: fields missing");
      return;
    }
    if (password != passwordRepeat) {
      console.log("passwords should match");
      setError("error: passwords should match");
      return;
    }

    const user = { username, email, password, passwordRepeat };

    axios.get(baseUrl + "/users/" + username + "/find").then(({ data }) => {
      if (data[0].username) {
        console.log("username already taken");
        setError("username already taken");
        return;
      }
      return axios
        .post(baseUrl + "/auth/signup", user)
        .then((resp) => {
          console.log(resp);
          navigate("/login");
        })
        .catch((err) => setError("Could not finish the process, try again", err));
    });
  };

  if (!loading && isLoggedIn) return <Navigate to="/dashboard" />;

  return (
    <>
      <NavbarLoggedOut />
      <div className="signup-container">
        <div id="watchadoin-descr">
          <p>Do you want to see what your friends are up to?</p>
          <p>Leave every worry aside, you are welcome to every plan you see!</p>
          <p>Join in now and enjoy an easier and more fulfilling social life. ✨</p>
        </div>
        <div id="signUp">
          <h2>Sign Up</h2>
          <form onSubmit={submitHandler} className="container signup-form">
            {error != "" && <Alert message={error} setError={setError} />}
            <div className="row">
              <div>
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input type="text" id="username" className="form-control" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input id="email" className="form-control" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input id="password" className="form-control" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <label htmlFor="passwordRepeat" className="form-label">
                  Password Repeat
                </label>
                <input id="passwordRepeat" className="form-control" type="password" name="passwordRepeat" value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} />
              </div>
              <div className="auth">
                <button type="submit" className="signup btn btn-primary">
                  SIGN UP
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
