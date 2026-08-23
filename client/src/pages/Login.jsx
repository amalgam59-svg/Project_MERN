import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Register from '../components/Register.jsx'
import ResetPassword from '../components/ResetPassword.jsx'

function Login() {
	const [view, setView] = useState('login') // 'login', 'register', 'reset'

	return (
		<div className="app-shell">
			<Navbar onLoginClick={() => {}} />
			<div className="login-page-container">
			{view === 'login' && (
				<div className="login-form">
					<h1>Login</h1>
					<form>
						<div className="form-group">
							<label htmlFor="email">Email</label>
							<input type="email" id="email" placeholder="Enter your email" />
						</div>
						<div className="form-group">
							<label htmlFor="password">Password</label>
							<input type="password" id="password" placeholder="Enter your password" />
						</div>
						<button type="submit" className="login-button">Login</button>
					</form>
					<div className="login-links">
						<button type="button" onClick={() => setView('reset')} className="link-button">
							Forgot Password?
						</button>
						<button type="button" onClick={() => setView('register')} className="link-button">
							Create an Account
						</button>
					</div>
				</div>
			)}

			{view === 'register' && (
				<div className="register-wrapper">
					<button type="button" onClick={() => setView('login')} className="back-button">
						← Back to Login
					</button>
					<Register />
				</div>
			)}

			{view === 'reset' && (
				<div className="reset-wrapper">
					<button type="button" onClick={() => setView('login')} className="back-button">
						← Back to Login
					</button>
					<ResetPassword />
				</div>
			)}
		</div>
		<Footer />
		</div>
	)
}

export default Login
