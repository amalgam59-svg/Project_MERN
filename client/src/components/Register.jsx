import { useState } from 'react'
import * as authService from '../services/authService.js'

function Register({ onSuccess, onError }) {
	const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
	const [fieldErrors, setFieldErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleChange = (e) => {
		const { id, value } = e.target
		setFormData((prev) => ({ ...prev, [id]: value }))
		setFieldErrors((prev) => ({ ...prev, [id]: '' }))
	}

	const validate = () => {
		const errors = {}
		if (!formData.name.trim()) errors.name = 'Full name is required'
		if (!formData.email.trim()) errors.email = 'Email is required'
		if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(formData.password)) {
			errors.password = 'Password must be at least 8 characters and include a letter and a number'
		}
		if (formData.confirmPassword !== formData.password) {
			errors['confirm-password'] = 'Passwords do not match'
		}
		setFieldErrors(errors)
		return Object.keys(errors).length === 0
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!validate()) return

		setIsSubmitting(true)
		try {
			const user = await authService.register(formData)
			onSuccess?.(user)
		} catch (err) {
			onError?.(err)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="register-form">
			<h1>Create Account</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="name">Full Name</label>
					<input type="text" id="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} />
					{fieldErrors.name && <span className="error-message">{fieldErrors.name}</span>}
				</div>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input type="email" id="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
					{fieldErrors.email && <span className="error-message">{fieldErrors.email}</span>}
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input type="password" id="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
					{fieldErrors.password && <span className="error-message">{fieldErrors.password}</span>}
				</div>
				<div className="form-group">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input type="password" id="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
					{fieldErrors['confirm-password'] && <span className="error-message">{fieldErrors['confirm-password']}</span>}
				</div>
				<button type="submit" className="register-button" disabled={isSubmitting}>
					{isSubmitting ? 'Creating Account…' : 'Create Account'}
				</button>
			</form>
		</div>
	)
}

export default Register

