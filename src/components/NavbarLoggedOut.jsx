import { Link } from "react-router-dom";

export default function NavbarLoggedOut() {
  return (
    <nav className="logged-out">
      <Link className="navbar-brand" to="/">
        <img src="/logo.png" />
      </Link>
      <Link className="log-in" to="/login">Log in</Link>
    </nav>
  );
}
