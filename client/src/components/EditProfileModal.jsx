import { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import * as userService from '../services/userService.js'
import UploadHandler from './UploadHandler.jsx'
import AccountDelete from './AccountDelete.jsx'

function EditProfileModal({ isOpen, onClose, profile, onUpdated }) {
	const [formData, setFormData] = useState({
		name: '',
		handle: '',
		avatar: '',
		bio: '',
		location: '',
		website: '',
		joinDate: '',
	})
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState(null)

	useEffect(() => {
		if (isOpen && profile) {
			setFormData({
				name: profile.name,
				handle: profile.handle,
				avatar: profile.avatar,
				bio: profile.bio,
				location: profile.location,
				website: profile.website,
				joinDate: profile.joinDate,
			})
			setErrors({})
			setSubmitError(null)
		}
	}, [isOpen, profile])

	if (!isOpen) return null

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
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
			const updatedUser = await userService.updateProfile({ name, handle, avatar, bio, location, website })
			onUpdated?.(updatedUser)
			onClose()
		} catch (err) {
			setSubmitError(err.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content edit-profile-modal-content" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close" onClick={onClose} aria-label="Close">
					<FiX />
				</button>

				<div className="edit-profile-header">
					<h1>Edit Profile</h1>
				</div>

				<form onSubmit={handleSubmit} className="edit-profile-form">
					{submitError && <span className="error-message">{submitError}</span>}

					<div className="form-group">
						<label htmlFor="modal-name">Full Name</label>
						<input
							type="text"
							id="modal-name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Enter your full name"
							className={errors.name ? 'input-error' : ''}
						/>
						{errors.name && <span className="error-message">{errors.name}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="modal-handle">Handle</label>
						<input
							type="text"
							id="modal-handle"
							name="handle"
							value={formData.handle}
							onChange={handleChange}
							placeholder="@yourhandle"
							className={errors.handle ? 'input-error' : ''}
						/>
						{errors.handle && <span className="error-message">{errors.handle}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="modal-avatar">Avatar URL</label>
						<input
							type="url"
							id="modal-avatar"
							name="avatar"
							value={formData.avatar}
							onChange={handleChange}
							placeholder="https://example.com/avatar.jpg"
							className={errors.avatar ? 'input-error' : ''}
						/>
						{errors.avatar && <span className="error-message">{errors.avatar}</span>}
						{formData.avatar && (
							<div className="avatar-preview">
								<img
									src={formData.avatar}
									alt="Avatar preview"
									onError={(e) => { e.target.style.display = 'none' }}
									onLoad={(e) => { e.target.style.display = 'block' }}
								/>
							</div>
						)}
						<UploadHandler label="Upload profile photo" onUpload={async (file) => {
							const url = await userService.uploadProfileImage(file)
							setFormData((previous) => ({ ...previous, avatar: url }))
						}} />
					</div>

					<div className="form-group">
						<label htmlFor="modal-bio">Bio</label>
						<textarea
							id="modal-bio"
							name="bio"
							value={formData.bio}
							onChange={handleChange}
							placeholder="Tell us about yourself"
							maxLength="160"
							rows="3"
							className={errors.bio ? 'input-error' : ''}
						/>
						<div className="character-count">{formData.bio.length}/160</div>
						{errors.bio && <span className="error-message">{errors.bio}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="modal-location">Location</label>
						<input
							type="text"
							id="modal-location"
							name="location"
							value={formData.location}
							onChange={handleChange}
							placeholder="City, State/Country"
							className={errors.location ? 'input-error' : ''}
						/>
						{errors.location && <span className="error-message">{errors.location}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="modal-website">Website</label>
						<input
							type="text"
							id="modal-website"
							name="website"
							value={formData.website}
							onChange={handleChange}
							placeholder="yourwebsite.com"
							className={errors.website ? 'input-error' : ''}
						/>
						{errors.website && <span className="error-message">{errors.website}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="modal-joinDate">Join Date</label>
						<input
							type="text"
							id="modal-joinDate"
							name="joinDate"
							value={formData.joinDate}
							disabled
							className="input-disabled"
						/>
						<small>This cannot be changed</small>
					</div>

					<div className="form-actions">
						<button type="submit" className="button-primary" disabled={isSubmitting}>
							{isSubmitting ? 'Saving…' : 'Save Changes'}
						</button>
						<button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
					</div>
					<AccountDelete />
				</form>
			</div>
		</div>
	)
}

export default EditProfileModal
