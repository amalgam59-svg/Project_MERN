import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import Register from './Register.jsx'
import ResetPassword from './ResetPassword.jsx'
import SocialLogin from './SocialLogin.jsx'
import * as authService from '../services/authService.js'

function LoginModal({ isOpen, onClose }) {
	const [view, setView] = useState('login') // 'login', 'register', 'reset'
	const [error, setError] = useState(null)
	const [formData, setFormData] = useState({ email: '', password: '' })
	const [isSubmitting, setIsSubmitting] = useState(false)

	if (!isOpen) return null

	const handleError = (err) => {
		console.error('LoginModal error:', err)
		setError(err?.message || 'An error occurred. ')
	}

	const handleFallback = () => {
		window.location.href = '/login'
	}

	const handleAuthSuccess = () => {
		onClose()
		window.location.reload()
	}

	const handleChange = (e) => {
		const { id, value } = e.target
		setFormData((prev) => ({ ...prev, [id]: value }))
	}

	const handleLoginSubmit = async (e) => {
		e.preventDefault()
		setError(null)
		setIsSubmitting(true)
		try {
			await authService.login(formData)
			handleAuthSuccess()
		} catch (err) {
			handleError(err)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close" onClick={onClose} aria-label="Close">
					<FiX />
				</button>

				{error && (
					<div className="modal-error">
						<p>{error}</p>
						<button onClick={handleFallback} className="fallback-button">
							Use Full Login Page
						</button>
					</div>
				)}

				{!error && view === 'login' && (
					<div className="login-form">
						<h1>Login</h1>
						<form onSubmit={handleLoginSubmit}>
							<div className="form-group">
								<label htmlFor="email">Email</label>
								<input type="email" id="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="password">Password</label>
								<input type="password" id="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
							</div>
							<button type="submit" className="login-button" disabled={isSubmitting}>
								{isSubmitting ? 'Logging in…' : 'Login'}
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

				{!error && view === 'register' && (
					<div className="register-wrapper">
						<button type="button" onClick={() => setView('login')} className="back-button">
							← Back to Login
						</button>
						<Register onSuccess={handleAuthSuccess} onError={handleError} />
					</div>
				)}

				{!error && view === 'reset' && (
					<div className="reset-wrapper">
						<button type="button" onClick={() => setView('login')} className="back-button">
							← Back to Login
						</button>
						<ResetPassword onError={handleError} />
					</div>
				)}
			</div>
		</div>
	)
}

export default LoginModal

