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

export const uploadPostImage = async (file) => {
	const formData = new FormData()
	formData.append('image', file)
	const data = await request('/posts/image', { method: 'POST', body: formData, headers: {} })
	return data.url
}

export const getPosts = async () => {
	const data = await request('/posts')
	return data.posts
}

export const getUserPosts = async (handle) => {
	const data = await request(`/posts/user/${handle}`)
	return data.posts
}

export const createPost = async ({ text, image }) => {
	const data = await request('/posts', {
		method: 'POST',
		body: JSON.stringify({ text, image }),
	})
	return data.post
}

export const toggleLike = async (postId) => {
	const data = await request(`/posts/${postId}/like`, { method: 'POST' })
	return data.post
}

export const getComments = async (postId) => {
	const data = await request(`/posts/${postId}/comments`)
	return data.comments
}

export const addComment = async (postId, text) => {
	const data = await request(`/posts/${postId}/comments`, {
		method: 'POST',
		body: JSON.stringify({ text }),
	})
	return data.comment
}

export const deleteComment = async (commentId) => {
	await request(`/comments/${commentId}`, { method: 'DELETE' })
}
