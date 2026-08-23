const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const request = async (path, options = {}) => {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: { 'Content-Type': 'application/json', ...options.headers },
		...options,
	})

	const data = await response.json()
	if (!response.ok) {
		throw new Error(data.message || 'Something went wrong')
	}

	return data
}

export const register = async ({ name, email, password }) => {
	const data = await request('/auth/register', {
		method: 'POST',
		body: JSON.stringify({ name, email, password }),
	})

	localStorage.setItem('token', data.token)
	localStorage.setItem('user', JSON.stringify(data.user))
	return data.user
}

export const login = async ({ email, password }) => {
	const data = await request('/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	})

	localStorage.setItem('token', data.token)
	localStorage.setItem('user', JSON.stringify(data.user))
	return data.user
}

export const requestPasswordReset = async (email) => {
	return request('/auth/forgot-password', {
		method: 'POST',
		body: JSON.stringify({ email }),
	})
}

export const resetPassword = async ({ token, password }) => {
	return request('/auth/reset-password', {
		method: 'POST',
		body: JSON.stringify({ token, password }),
	})
}

export const logout = async () => {
	const token = localStorage.getItem('token')

	try {
		await request('/auth/logout', {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },
		})
	} finally {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
	}
}

export const getCurrentUser = () => {
	const user = localStorage.getItem('user')
	return user ? JSON.parse(user) : null
}
