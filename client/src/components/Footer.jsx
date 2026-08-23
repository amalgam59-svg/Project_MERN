import { Link } from 'react-router-dom'

function Footer() {
	return (
		<footer className="site-footer">
			<div className="footer-content">
				<div className="footer-brand">
					<span className="brand-mark">N</span>
					<span>Nook</span>
				</div>

				<nav className="footer-links">
					<Link to="/">Feed</Link>
					<Link to="/profile">Profile</Link>
					<Link to="/login">Login</Link>
				</nav>

				<p className="footer-copyright">
					&copy; {new Date().getFullYear()} Nook. All rights reserved.
				</p>
			</div>
		</footer>
	)
}

export default Footer
