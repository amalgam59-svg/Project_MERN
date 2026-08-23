import { useState } from 'react'
import { FiBookmark, FiHeart, FiMessageCircle, FiMoreHorizontal, FiShare2 } from 'react-icons/fi'
import * as postService from '../services/postService.js'
import { formatRelativeTime } from '../utils/formatTime.js'

function PostCard({ post, onLike }) {
	const [showComments, setShowComments] = useState(false)
	const [comments, setComments] = useState([])
	const [commentsLoaded, setCommentsLoaded] = useState(false)
	const [commentText, setCommentText] = useState('')
	const [commentCount, setCommentCount] = useState(post.comments)

	const loadComments = async () => {
		try {
			const data = await postService.getComments(post.id)
			setComments(data)
			setCommentsLoaded(true)
		} catch (err) {
			console.error('Failed to load comments:', err)
		}
	}

	const toggleComments = () => {
		setShowComments((current) => !current)
		if (!commentsLoaded) loadComments()
	}

	const handleAddComment = async (e) => {
		e.preventDefault()
		if (!commentText.trim()) return

		try {
			const comment = await postService.addComment(post.id, commentText.trim())
			setComments((current) => [...current, comment])
			setCommentCount((current) => current + 1)
			setCommentText('')
		} catch (err) {
			console.error('Failed to add comment:', err)
		}
	}

	return (
		<article className="post-card">
			<div className="post-top">
				<img src={post.author.avatar} alt={post.author.name} />
				<div className="post-author">
					<strong>{post.author.name}</strong>
					<span>{post.author.handle} <i>·</i> {formatRelativeTime(post.createdAt)}</span>
				</div>
				<button className="more-button" aria-label="More options"><FiMoreHorizontal /></button>
			</div>
			<p className="post-text">{post.text}</p>
			{post.image && <img className="post-image" src={post.image} alt="Post visual" />}
			<div className="post-actions">
				<button className={post.liked ? 'liked' : ''} onClick={() => onLike(post.id)}>
					<FiHeart /> {post.likes}
				</button>
				<button onClick={toggleComments}><FiMessageCircle /> {commentCount}</button>
				<button><FiShare2 /></button>
				<button className="save-action"><FiBookmark /></button>
			</div>

			{showComments && (
				<div className="comments-section">
					{comments.map((comment) => (
						<div className="comment-row" key={comment.id}>
							<img src={comment.author.avatar} alt={comment.author.name} />
							<div>
								<strong>{comment.author.name}</strong>
								<span>{comment.text}</span>
							</div>
						</div>
					))}
					<form className="comment-form" onSubmit={handleAddComment}>
						<input
							type="text"
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							placeholder="Write a comment..."
						/>
						<button type="submit">Post</button>
					</form>
				</div>
			)}
		</article>
	)
}

export default PostCard

