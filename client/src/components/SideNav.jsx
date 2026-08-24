import {
	FiChevronDown,
	FiHome,
	FiSend,
} from 'react-icons/fi'

function SideNav() {
    return (
    <aside className="left-column">
        <div className="profile-mini">
            <img src="https://i.pravatar.cc/96?img=11" alt="Alex Morgan" />
            <div><strong>Alex Morgan</strong><span>@alexmorgan</span></div>
            <FiChevronDown className="muted-icon" />
        </div>
        <nav className="side-nav" aria-label="Main navigation">
            <a className="active" href="#feed"><FiHome /> Home</a>
        </nav>
        <button className="new-post-button" onClick={() => document.querySelector('.composer textarea')?.focus()}><FiSend /> New post</button>
        <div className="side-footer"><span>© 2026 nook</span></div>
    </aside>
    )
}
export default SideNav