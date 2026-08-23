import { useState } from 'react'
import * as authService from '../services/authService.js'

function ResetPassword({ onError }) {
	const [token] = useState(() => new URLSearchParams(window.location.search).get('resetToken'))
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState(null)
	const [error, setError] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError(null)
		setMessage(null)

		if (token && password !== confirmPassword) {
			setError('Passwords do not match')
			return
		}

		setIsSubmitting(true)
		try {
			if (token) {
				await authService.resetPassword({ token, password })
				setMessage('Your password has been reset. You can now log in.')
				window.history.replaceState({}, '', '/login')
			} else {
				const result = await authService.requestPasswordReset(email)
				setMessage(result.message)
			}
		} catch (err) {
			setError(err?.message || 'Unable to process your request. Please try again.')
			onError?.(err)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="reset-password-form">
			<h1>{token ? 'Choose a New Password' : 'Reset Password'}</h1>
			{error && <p className="error-message" role="alert">{error}</p>}
			{message && <p className="success-message" role="status">{message}</p>}
			<form onSubmit={handleSubmit}>
				{!token && (
					<div className="form-group">
						<label htmlFor="reset-email">Email Address</label>
						<input type="email" id="reset-email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					</div>
				)}
				{token && (
					<>
						<div className="form-group">
							<label htmlFor="reset-password">New Password</label>
							<input type="password" id="reset-password" placeholder="Enter your new password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="8" required />
						</div>
						<div className="form-group">
							<label htmlFor="confirm-reset-password">Confirm New Password</label>
							<input type="password" id="confirm-reset-password" placeholder="Confirm your new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength="8" required />
						</div>
					</>
				)}
				{!token && <p className="info-text">We'll send you a link to reset your password.</p>}
				<button type="submit" className="reset-button" disabled={isSubmitting}>
					{isSubmitting ? 'Please wait...' : token ? 'Reset Password' : 'Send Reset Link'}
				</button>
			</form>
		</div>
	)
}

export default ResetPassword
