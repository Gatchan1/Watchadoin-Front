import { Link } from 'react-router-dom'

export default function NavbarLoggedOut() {
  return (
    <nav className="nav">
    <Link className="navbar-brand" to="/"><img src="/logo.png"/></Link>
    <div>
        <Link to="/login">Log in</Link>
    </div>
</nav>
  )
}