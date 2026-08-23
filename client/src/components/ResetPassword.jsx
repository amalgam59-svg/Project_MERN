function ResetPassword() {
	return (
		<div className="reset-password-form">
			<h1>Reset Password</h1>
			<form>
				<div className="form-group">
					<label htmlFor="email">Email Address</label>
					<input type="email" id="email" placeholder="Enter your email" />
				</div>
				<p className="info-text">We'll send you a link to reset your password.</p>
				<button type="submit" className="reset-button">Send Reset Link</button>
			</form>
		</div>
	)
}

export default ResetPassword
