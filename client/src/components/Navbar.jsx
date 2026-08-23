import { FiBell, FiCompass, FiHome, FiPlus, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'

function Navbar({ onLoginClick }) {
	const handleLoginClick = () => {
		try {
			onLoginClick()
		} catch (error) {
			// Fallback to login page if modal fails
			window.location.href = '/login'
		}
	}

	return (
		<header className="topbar">
			<Link to="/" className="wordmark">
				<span className="brand-mark">N</span>
				<span>nook</span>
			</Link>
			<nav className="top-nav">
				<Link to="/" className="selected"><FiHome /> Feed</Link>
				<a href="#discover"><FiCompass /> Discover</a>
				<Link to="/profile"><FiUser /> Profile</Link>
				<button onClick={handleLoginClick} className="nav-login-button"><FiUser /> Login</button>
			</nav>
			<div className="top-actions">
				<button className="quick-post" aria-label="Create post"><FiPlus /></button>
				<button className="icon-button" aria-label="Notifications"><FiBell /></button>
				<img className="top-avatar" src="https://i.pravatar.cc/96?img=11" alt="Alex Morgan" />
				<FiUser className="mobile-user" />
			</div>
		</header>
	)
}

export default Navbar
