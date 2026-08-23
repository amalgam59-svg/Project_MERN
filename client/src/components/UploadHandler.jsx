import { useRef, useState } from 'react'

function UploadHandler({ onUpload, accept = 'image/jpeg,image/png,image/webp,image/gif', label = 'Upload image' }) {
	const inputRef = useRef(null)
	const [error, setError] = useState(null)
	const [isUploading, setIsUploading] = useState(false)

	const handleChange = async (event) => {
		const file = event.target.files?.[0]
		event.target.value = ''
		if (!file) return
		if (!file.type.startsWith('image/')) {
			setError('Please choose an image file')
			return
		}
		if (file.size > 5 * 1024 * 1024) {
			setError('Images must be 5 MB or smaller')
			return
		}

		setError(null)
		setIsUploading(true)
		try {
			await onUpload(file)
		} catch (uploadError) {
			setError(uploadError.message || 'Image upload failed')
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<div className="upload-handler">
			<input ref={inputRef} type="file" accept={accept} onChange={handleChange} hidden />
			<button type="button" className="upload-button" onClick={() => inputRef.current?.click()} disabled={isUploading}>
				{isUploading ? 'Uploading...' : label}
			</button>
			{error && <span className="error-message" role="alert">{error}</span>}
		</div>
	)
}

export default UploadHandler
