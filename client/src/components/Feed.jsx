import { FiChevronDown, FiImage, FiSend } from 'react-icons/fi'
import PostCard from './PostCard.jsx'

function Feed({ postText, setPostText, publishPost, posts, toggleLike, currentUser }) {
    return(
    <section className="feed-column" id="feed">
        <div className="feed-heading"><div><p className="eyebrow">Your community</p><h1>Good morning{currentUser ? `, ${currentUser.name.split(' ')[0]}` : ''}.</h1></div><button className="filter-button">Latest <FiChevronDown /></button></div>
        <form className="composer" onSubmit={publishPost}>
            <img src={currentUser?.avatar || 'https://i.pravatar.cc/96?img=11'} alt="" />
            <div className="composer-body"><textarea value={postText} onChange={(event) => setPostText(event.target.value)} placeholder="Share something with your community..." rows="2" /><div className="composer-actions"><button type="button" className="attach-button"><FiImage /> Add photo</button><button className="publish-button" type="submit">Post <FiSend /></button></div></div>
        </form>
        <div className="feed-list">{posts.map((post) => <PostCard key={post.id} post={post} onLike={toggleLike} />)}</div>
    </section>
    )
}

export default Feed
