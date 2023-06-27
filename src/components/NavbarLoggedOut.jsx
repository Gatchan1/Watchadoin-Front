import { Link } from 'react-router-dom'

export default function NavbarLoggedOut() {
  return (
    <nav className="nav">
    <Link className="navbar-brand" to="/"><img src="/logo.png"/></Link>
    <div className="signYlogin">
        <Link to="/signup">Sign up |</Link>
        <Link to="/login">Log in</Link>
    </div>
</nav>
  )
}