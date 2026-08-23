const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const authHeader = () => {
	const token = localStorage.getItem('token')
	return token ? { Authorization: `Bearer ${token}` } : {}
}

const request = async (path, options = {}) => {
	const headers = options.body instanceof FormData
		? { ...authHeader(), ...options.headers }
		: { 'Content-Type': 'application/json', ...authHeader(), ...options.headers }
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers,
		...options,
	})

	const data = await response.json()
	if (!response.ok) {
		throw new Error(data.message || 'Something went wrong')
	}

	return data
}

export const uploadProfileImage = async (file) => {
	const formData = new FormData()
	formData.append('image', file)
	const data = await request('/users/profile/image', { method: 'POST', body: formData, headers: {} })
	return data.url
}

export const getProfile = async () => {
	const data = await request('/users/profile')
	return data.user
}

export const updateProfile = async (updates) => {
	const data = await request('/users/profile', {
		method: 'PUT',
		body: JSON.stringify(updates),
	})

	localStorage.setItem('user', JSON.stringify(data.user))
	return data.user
}

export const deleteAccount = async () => {
	await request('/users/profile', { method: 'DELETE' })
	localStorage.removeItem('token')
	localStorage.removeItem('user')
}

export const getSuggestions = async () => {
	const data = await request('/users/suggestions')
	return data.suggestions
}

export const followUser = async (handle) => {
	const data = await request(`/users/${handle}/follow`, { method: 'POST' })
	return data
}

// Maps a raw User document from the API to the shape the profile UI renders
export const mapUserToProfile = (user) => ({
	name: user.name,
	handle: user.handle,
	avatar: user.avatar || '',
	bio: user.bio || '',
	location: user.location || '',
	website: user.website || '',
	joinDate: user.createdAt
		? `Joined ${new Date(user.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}`
		: '',
	posts: 0,
	followers: user.followers?.length || 0,
	following: user.following?.length || 0,
})
