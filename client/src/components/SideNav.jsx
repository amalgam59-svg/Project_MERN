import {
	FiBell,
	FiBookmark,
	FiChevronDown,
	FiHome,
	FiSearch,
	FiSend,
	FiSettings,
	FiUsers,
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
            <a href="#explore"><FiSearch /> Explore</a>
            <a href="#notifications"><FiBell /> Notifications <b>3</b></a>
            <a href="#saved"><FiBookmark /> Saved</a>
            <a href="#people"><FiUsers /> People</a>
        </nav>
        <button className="new-post-button" onClick={() => document.querySelector('.composer textarea')?.focus()}><FiSend /> New post</button>
        <div className="side-footer"><a href="#settings"><FiSettings /> Settings</a><span>© 2024 nook</span></div>
    </aside>
    )
}
export default SideNav