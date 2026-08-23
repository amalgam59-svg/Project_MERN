const SIZES = {
	small: 18,
	medium: 32,
	large: 48,
}

function Loader({ size = 'medium', text, fullPage = false }) {
	const dimension = SIZES[size] || SIZES.medium

	const spinner = (
		<div className="loader" role="status" aria-live="polite">
			<span
				className="loader-spinner"
				style={{ width: dimension, height: dimension }}
			/>
			{text && <span className="loader-text">{text}</span>}
		</div>
	)

	if (fullPage) {
		return <div className="loader-overlay">{spinner}</div>
	}

	return spinner
}

export default Loader
