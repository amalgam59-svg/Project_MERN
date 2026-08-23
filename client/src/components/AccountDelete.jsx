import { useState } from 'react'
import * as userService from '../services/userService.js'

function AccountDelete() {
	const [isDeleting, setIsDeleting] = useState(false)
	const [error, setError] = useState(null)

	const handleDelete = async () => {
		if (!window.confirm('Delete your account permanently? This cannot be undone.')) return

		setError(null)
		setIsDeleting(true)
		try {
			await userService.deleteAccount()
			window.location.replace('/login')
		} catch (deleteError) {
			setError(deleteError.message || 'Failed to delete account')
			setIsDeleting(false)
		}
	}

	return (
		<div className="account-delete">
			<button type="button" className="button-danger" onClick={handleDelete} disabled={isDeleting}>
				{isDeleting ? 'Deleting account...' : 'Delete account'}
			</button>
			{error && <span className="error-message" role="alert">{error}</span>}
		</div>
	)
}

export default AccountDelete
