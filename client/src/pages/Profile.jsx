import { useEffect, useState } from 'react'
import { FiBell, FiMapPin, FiCalendar, FiLink } from 'react-icons/fi'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Loader from '../components/Loader.jsx'
import LoginModal from '../components/LoginModal.jsx'
import EditProfileModal from '../components/EditProfileModal.jsx'
import * as userService from '../services/userService.js'

function Profile() {
	const [isLoginOpen, setIsLoginOpen] = useState(false)
	const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
	const [profile, setProfile] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			setIsLoading(false)
			return
		}

		userService.getProfile()
			.then((user) => setProfile(userService.mapUserToProfile(user)))
			.catch((err) => setError(err.message))
			.finally(() => setIsLoading(false))
	}, [])

	if (isLoading) {
		return (
			<div className="app-shell">
				<Navbar onLoginClick={() => setIsLoginOpen(true)} />
				<Loader fullPage text="Loading profile…" />
				<LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
			</div>
		)
	}

	if (!profile) {
		return (
			<div className="app-shell">
				<Navbar onLoginClick={() => setIsLoginOpen(true)} />
				<div className="profile-page-container">
					<div className="empty-state">
						<p>{error || 'Log in to view your profile.'}</p>
						<button className="button-primary" onClick={() => setIsLoginOpen(true)}>
							Log In
						</button>
					</div>
				</div>
				<LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
				<Footer />
			</div>
		)
	}

	return (
		<div className="app-shell">
			<Navbar onLoginClick={() => setIsLoginOpen(true)} />
			<div className="profile-page-container">
				<div className="profile-header">
					<div className="profile-banner" style={{
						backgroundImage: 'linear-gradient(135deg, #2f6f5d 0%, #dcefe8 100%)',
						height: '200px',
					}}></div>

					<div className="profile-info">
						<img src={profile.avatar} alt={profile.name} className="profile-avatar" />
						
						<div className="profile-details">
                        <h1>{profile.name}</h1>
						<p className="profile-handle">{profile.handle}</p>
						<p className="profile-bio">{profile.bio}</p>

							<div className="profile-meta">
							{profile.location && (
								<span className="meta-item">
									<FiMapPin /> {profile.location}
								</span>
							)}
							{profile.website && (
								<span className="meta-item">
									<FiLink /> {profile.website}
								</span>
							)}
							{profile.joinDate && (
								<span className="meta-item">
									<FiCalendar /> {profile.joinDate}
									</span>
								)}
							</div>

							<div className="profile-stats">
								<div className="stat">
									<strong>{profile.posts}</strong>
									<span>Posts</span>
								</div>
								<div className="stat">
									<strong>{profile.followers}</strong>
									<span>Followers</span>
								</div>
								<div className="stat">
									<strong>{profile.following}</strong>
									<span>Following</span>
								</div>
							</div>
						</div>

						<button className="edit-profile-button" onClick={() => setIsEditProfileOpen(true)}>
							Edit Profile
						</button>
					</div>
				</div>

				<div className="profile-content">
					<div className="profile-tabs">
						<button className="tab-button active">Posts</button>
						<button className="tab-button">Media</button>
						<button className="tab-button">Likes</button>
					</div>

					<div className="profile-feed">
						<div className="empty-state">
							<p>No posts yet</p>
						</div>
					</div>
				</div>
			</div>

			<LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
			<EditProfileModal
				isOpen={isEditProfileOpen}
				profile={profile}
				onClose={() => setIsEditProfileOpen(false)}
				onUpdated={(updatedUser) => setProfile(userService.mapUserToProfile(updatedUser))}
			/>
			<Footer />
		</div>
	)
}

export default Profile

