import { useState } from 'react'
import { FiBookmark, FiEdit2, FiHeart, FiMessageCircle, FiShare2, FiTrash2 } from 'react-icons/fi'
import * as postService from '../services/postService.js'
import { formatRelativeTime } from '../utils/formatTime.js'

function PostCard({ post, onLike, currentUser, onDeleted }) {
	const [showComments, setShowComments] = useState(false)
	const [comments, setComments] = useState([])
	const [commentsLoaded, setCommentsLoaded] = useState(false)
	const [commentText, setCommentText] = useState('')
	const [commentCount, setCommentCount] = useState(post.comments)
	const [isEditing, setIsEditing] = useState(false)
	const [displayText, setDisplayText] = useState(post.text || '')
	const [editText, setEditText] = useState(post.text || '')
	const [isDeleting, setIsDeleting] = useState(false)

	const isPostOwner = currentUser?.id === (post.author.id || post.author._id)

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

	const handleUpdatePost = async (e) => {
		e.preventDefault()
		if (!editText.trim() && !post.image) return

		try {
			await postService.updatePost(post.id, { text: editText.trim(), image: post.image })
			setDisplayText(editText.trim())
			setIsEditing(false)
		} catch (err) {
			console.error('Failed to update post:', err)
		}
	}

	const handleDeletePost = async () => {
		if (!window.confirm('Delete this post permanently?')) return

		setIsDeleting(true)
		try {
			await postService.deletePost(post.id)
			onDeleted?.(post.id)
		} catch (err) {
			console.error('Failed to delete post:', err)
			setIsDeleting(false)
		}
	}

	const handleDeleteComment = async (commentId) => {
		try {
			await postService.deleteComment(commentId)
			setComments((current) => current.filter((comment) => comment.id !== commentId))
			setCommentCount((current) => Math.max(current - 1, 0))
		} catch (err) {
			console.error('Failed to delete comment:', err)
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
				{isPostOwner && <div className="post-owner-actions">
					<button className="more-button" onClick={() => setIsEditing((current) => !current)} aria-label="Edit post"><FiEdit2 /></button>
					<button className="more-button" onClick={handleDeletePost} disabled={isDeleting} aria-label="Delete post"><FiTrash2 /></button>
				</div>}
			</div>
			{isEditing ? (
				<form className="post-edit-form" onSubmit={handleUpdatePost}>
					<textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows="3" />
					<div><button type="submit">Save</button><button type="button" onClick={() => setIsEditing(false)}>Cancel</button></div>
				</form>
			) : <p className="post-text">{displayText}</p>}
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
							{currentUser?.id === (comment.author.id || comment.author._id) && <button type="button" className="comment-delete-button" onClick={() => handleDeleteComment(comment.id)} aria-label="Delete comment"><FiTrash2 /></button>}
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

