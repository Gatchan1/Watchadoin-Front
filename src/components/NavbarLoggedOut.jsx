import { Link, useLocation } from "react-router-dom";

export default function NavbarLoggedOut() {
  let location = useLocation();

  return (
    <nav className="logged-out">
      <Link className="navbar-brand" to="/">
        <img src="/logo.png" />
      </Link>
      {location.pathname == "/signup" && <Link className="log-in" to="/login">Log in</Link>}
      {location.pathname == "/login" && <Link className="log-in" to="/signup">Sign up</Link>}
    </nav>
  );
}
