import { FiChrome } from 'react-icons/fi'
import * as authService from '../services/authService.js'

function SocialLogin() {
	const handleGoogleLogin = () => {
		window.location.assign(authService.getGoogleLoginUrl())
	}

	return (
		<div className="social-login">
			<div className="social-divider"><span>or continue with</span></div>
			<button type="button" className="social-login-button" onClick={handleGoogleLogin}>
				<FiChrome aria-hidden="true" />
				Continue with Google
			</button>
		</div>
	)
}

export default SocialLogin