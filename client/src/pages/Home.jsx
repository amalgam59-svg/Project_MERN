import { useEffect, useState } from 'react'
import { FiBell } from 'react-icons/fi'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import SideNav from '../components/SideNav.jsx'
import RightColumn from '../components/RightColumn.jsx'
import Feed from '../components/Feed.jsx'
import LoginModal from '../components/LoginModal.jsx'
import Loader from '../components/Loader.jsx'
import * as postService from '../services/postService.js'
import * as userService from '../services/userService.js'
import { getCurrentUser } from '../services/authService.js'
import initialPosts from '../data/InitialPosts.js'
import fallbackSuggestions from '../data/Suggestions.js'

const LOAD_TIMEOUT_MS = 30000

// Wraps a promise so a slow/unresponsive API falls back to local data instead of hanging forever
const withTimeout = (promise, ms) => Promise.race([
	promise,
	new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms)),
])

// Adapts the legacy static post shape (author/handle/avatar as separate strings) to the API shape
const mapLegacyPost = (post) => ({
	id: post.id,
	author: { name: post.author, handle: post.handle, avatar: post.avatar },
	text: post.text,
	image: post.image,
	likes: post.likes,
	liked: post.liked,
	comments: post.comments,
	createdAt: new Date().toISOString(),
})

function Home() {
	const [posts, setPosts] = useState([])
	const [postText, setPostText] = useState('')
	const [postImage, setPostImage] = useState('')
	const [suggestions, setSuggestions] = useState(() => localStorage.getItem('token') ? [] : fallbackSuggestions)
	const [isLoginOpen, setIsLoginOpen] = useState(false)
	const [isLoadingPosts, setIsLoadingPosts] = useState(true)

	const isAuthenticated = () => Boolean(localStorage.getItem('token'))

	const requireLogin = () => {
		if (isAuthenticated()) return true
		setIsLoginOpen(true)
		return false
	}

	useEffect(() => {
		withTimeout(postService.getPosts(), LOAD_TIMEOUT_MS)
			.then(setPosts)
			.catch((err) => {
				console.error('Failed to load posts, using local backup:', err)
				setPosts(initialPosts.map(mapLegacyPost))
			})
			.finally(() => setIsLoadingPosts(false))

		if (isAuthenticated()) {
			withTimeout(userService.getSuggestions(), LOAD_TIMEOUT_MS)
				.then(setSuggestions)
				.catch((err) => {
					console.error('Failed to load suggestions, using local backup:', err)
					setSuggestions(fallbackSuggestions)
				})
		}
	}, [])


	const toggleLike = async (id) => {
		if (!requireLogin()) return

		try {
			const updatedPost = await postService.toggleLike(id)
			setPosts((current) => current.map((post) => post.id === id ? updatedPost : post))
		} catch (err) {
			console.error('Failed to toggle like:', err)
		}
	}

	const publishPost = async (event) => {
		event.preventDefault()
		if ((!postText.trim() && !postImage) || !requireLogin()) return

		try {
			const newPost = await postService.createPost({ text: postText.trim(), image: postImage })
			setPosts((current) => [newPost, ...current])
			setPostText('')
			setPostImage('')
		} catch (err) {
			console.error('Failed to publish post:', err)
		}
	}

	const toggleFollow = async (handle) => {
		if (!requireLogin()) return

		try {
			await userService.followUser(handle)
			setSuggestions((current) => current.filter((person) => person.handle !== handle))
		} catch (err) {
			console.error('Failed to follow user:', err)
		}
	}

	const handlePostDeleted = (postId) => {
		setPosts((current) => current.filter((post) => post.id !== postId))
	}

	const currentUser = getCurrentUser()

	if (isLoadingPosts) {
		return (
			<div className="app-shell">
				<Navbar onLoginClick={() => setIsLoginOpen(true)} />
				<Loader fullPage text="Loading your feed…" />
			</div>
		)
	}

	return (
		<div className="app-shell">
			<Navbar onLoginClick={() => setIsLoginOpen(true)} />
			<div className="page-wrap">
				<header className="mobile-header">
					<span className="brand-mark">N</span><span>nook</span>
					<button className="icon-button" aria-label="Notifications"><FiBell /></button>
				</header>

				<main className="dashboard-grid">
					<SideNav />

					<Feed 
						postText={postText}
						setPostText={setPostText}
						postImage={postImage}
						setPostImage={setPostImage}
						publishPost={publishPost}
						posts={posts}
						toggleLike={toggleLike}
						currentUser={currentUser}
						onPostDeleted={handlePostDeleted}
					/>

					<RightColumn suggestions={suggestions} toggleFollow={toggleFollow} />
				</main>
			</div>
			<LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
			<Footer />
		</div>
	)
}

export default Home

