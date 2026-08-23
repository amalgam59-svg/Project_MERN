import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Register from '../components/Register.jsx'
import ResetPassword from '../components/ResetPassword.jsx'
import SocialLogin from '../components/SocialLogin.jsx'
import * as authService from '../services/authService.js'

function Login() {
	const [view, setView] = useState('login') // 'login', 'register', 'reset'
	const [formData, setFormData] = useState({ email: '', password: '' })
	const [error, setError] = useState(() => new URLSearchParams(window.location.search).get('socialError'))
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const socialToken = params.get('socialToken')
		const socialError = params.get('socialError')

		if (socialToken) {
			authService.completeSocialLogin(socialToken)
			window.location.replace('/')
		} else if (socialError) {
			window.history.replaceState({}, '', '/login')
		}
	}, [])

	const handleChange = (e) => {
		const { id, value } = e.target
		setFormData((previous) => ({ ...previous, [id]: value }))
	}

	const handleLoginSubmit = async (e) => {
		e.preventDefault()
		setError(null)
		setIsSubmitting(true)

		try {
			await authService.login(formData)
			window.location.href = '/'
		} catch (err) {
			setError(err?.message || 'Unable to log in. Please try again.')
			setIsSubmitting(false)
		}
	}

	return (
		<div className="app-shell">
			<Navbar onLoginClick={() => {}} />
			<div className="login-page-container">
			{view === 'login' && (
				<div className="login-form">
					<h1>Login</h1>
					{error && <p className="modal-error" role="alert">{error}</p>}
					<form onSubmit={handleLoginSubmit}>
						<div className="form-group">
							<label htmlFor="email">Email</label>
							<input type="email" id="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
						</div>
						<div className="form-group">
							<label htmlFor="password">Password</label>
							<input type="password" id="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
						</div>
						<button type="submit" className="login-button" disabled={isSubmitting}>
							{isSubmitting ? 'Logging in...' : 'Login'}
						</button>
					</form>
					<SocialLogin />
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
