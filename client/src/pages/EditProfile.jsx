import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader.jsx'
import { FiX } from 'react-icons/fi'
import * as userService from '../services/userService.js'

export default function EditProfile() {
	const navigate = useNavigate()
	const [isLoginOpen, setIsLoginOpen] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		handle: '',
		avatar: '',
		bio: '',
		location: '',
		website: '',
		joinDate: '',
	})
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState(null)

	const [errors, setErrors] = useState({})

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/profile')
			return
		}

		userService.getProfile()
			.then((user) => setFormData(userService.mapUserToProfile(user)))
			.catch((err) => setSubmitError(err.message))
			.finally(() => setIsLoading(false))
	}, [navigate])

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
		// Clear error for this field when user starts typing
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: '',
			})
		}
	}

const validateForm = () => {
	const newErrors = {}

	if (!formData.name.trim()) {
		newErrors.name = 'Name is required'
	}

	if (!formData.handle.trim()) {
		newErrors.handle = 'Handle is required'
	} else if (!formData.handle.startsWith('@')) {
		newErrors.handle = 'Handle must start with @'
	}

	if (formData.bio.length > 160) {
		newErrors.bio = 'Bio must be 160 characters or less'
	}

	setErrors(newErrors)

	return Object.keys(newErrors).length === 0
}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		setIsSubmitting(true)
		setSubmitError(null)
		try {
			const { name, handle, avatar, bio, location, website } = formData
			await userService.updateProfile({ name, handle, avatar, bio, location, website })
			navigate('/profile')
		} catch (err) {
			setSubmitError(err.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleCancel = () => {
		navigate('/profile')
	}

	if (isLoading) {
		return (
			<div className="app-shell">
				<Navbar onLoginClick={() => setIsLoginOpen(true)} />
				<Loader fullPage text="Loading profile…" />
			</div>
		)
	}

	return (
		<div className="app-shell">
			<Navbar onLoginClick={() => setIsLoginOpen(true)} />

			<div className="edit-profile-container">
				<div className="edit-profile-card">
					<div className="edit-profile-header">
						<h1>Edit Profile</h1>
						<button
							className="close-button"
							onClick={handleCancel}
							aria-label="Close"
						>
							<FiX size={24} />
						</button>
					</div>

					<form onSubmit={handleSubmit} className="edit-profile-form">
						{submitError && <span className="error-message">{submitError}</span>}

						{/* Name Field */}
						<div className="form-group">
							<label htmlFor="name">Full Name</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="Enter your full name"
								className={errors.name ? 'input-error' : ''}
							/>
							{errors.name && (
								<span className="error-message">{errors.name}</span>
							)}
						</div>

						{/* Handle Field */}
						<div className="form-group">
							<label htmlFor="handle">Handle</label>
							<input
								type="text"
								id="handle"
								name="handle"
								value={formData.handle}
								onChange={handleChange}
								placeholder="@yourhandle"
								className={errors.handle ? 'input-error' : ''}
							/>
							{errors.handle && (
								<span className="error-message">{errors.handle}</span>
							)}
						</div>

						{/* Avatar URL Field */}
						<div className="form-group">
							<label htmlFor="avatar">Avatar URL</label>
							<input
								type="url"
								id="avatar"
								name="avatar"
								value={formData.avatar}
								onChange={handleChange}
								placeholder="https://example.com/avatar.jpg"
								className={errors.avatar ? 'input-error' : ''}
							/>
							{errors.avatar && (
								<span className="error-message">{errors.avatar}</span>
							)}
							{formData.avatar && (
								<div className="avatar-preview">
									<img
										src={formData.avatar}
										alt="Avatar preview"
										onError={(e) => {
											e.target.style.display = 'none'
										}}
										onLoad={(e) => {
											e.target.style.display = 'block'
										}}
									/>
								</div>
							)}
						</div>

						{/* Bio Field */}
						<div className="form-group">
							<label htmlFor="bio">Bio</label>
							<textarea
								id="bio"
								name="bio"
								value={formData.bio}
								onChange={handleChange}
								placeholder="Tell us about yourself"
								maxLength="160"
								rows="3"
								className={errors.bio ? 'input-error' : ''}
							/>
							<div className="character-count">
								{formData.bio.length}/160
							</div>
							{errors.bio && (
								<span className="error-message">{errors.bio}</span>
							)}
						</div>

						{/* Location Field */}
						<div className="form-group">
							<label htmlFor="location">Location</label>
							<input
								type="text"
								id="location"
								name="location"
								value={formData.location}
								onChange={handleChange}
								placeholder="City, State/Country"
								className={errors.location ? 'input-error' : ''}
							/>
							{errors.location && (
								<span className="error-message">{errors.location}</span>
							)}
						</div>

						{/* Website Field */}
						<div className="form-group">
							<label htmlFor="website">Website</label>
							<input
								type="text"
								id="website"
								name="website"
								value={formData.website}
								onChange={handleChange}
								placeholder="yourwebsite.com"
								className={errors.website ? 'input-error' : ''}
							/>
							{errors.website && (
								<span className="error-message">{errors.website}</span>
							)}
						</div>

						{/* Join Date Field (Read-only) */}
						<div className="form-group">
							<label htmlFor="joinDate">Join Date</label>
							<input
								type="text"
								id="joinDate"
								name="joinDate"
								value={formData.joinDate}
								disabled
								className="input-disabled"
							/>
							<small>This cannot be changed</small>
						</div>

						{/* Form Actions */}
						<div className="form-actions">
							<button type="submit" className="button-primary" disabled={isSubmitting}>
								{isSubmitting ? 'Saving…' : 'Save Changes'}
							</button>
							<button
								type="button"
								className="button-secondary"
								onClick={handleCancel}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
			<Footer />
		</div>
	)
}
