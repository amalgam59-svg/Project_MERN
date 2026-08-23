# Nook

Nook is a MERN social networking application. Users can create profiles, publish text and image posts, like and comment on posts, follow other users, and authenticate with email/password or Google.

## Project Structure

```text
client/   React + Vite frontend
server/   Express + MongoDB API
```

## Requirements

- Node.js 18 or newer
- MongoDB local instance or MongoDB Atlas database
- Cloudinary account for profile and post images
- Google Cloud OAuth credentials for Google login (optional)
- SMTP credentials for password-reset email delivery (optional)

## Local Setup

```powershell
cd server
npm install

cd ..\client
npm install
```

Create `server/.env` from [server/.env.example](server/.env.example). Configure `PORT`, `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` at minimum. Add the optional Google, Cloudinary, and SMTP variables when those features are enabled. Never commit `.env` files or real credentials.

## Run Locally

Start the API:

```powershell
cd server
npm run dev
```

Start the frontend in a second terminal:

```powershell
cd client
npm run dev
```

The default frontend URL is `http://localhost:5173`; the API URL is `http://localhost:5000`. Check the API with `GET http://localhost:5000/api/health`.

Client checks:

```powershell
cd client
npm run lint
npm run build
```

## Authentication

Registration and login return a JWT. Send it on protected requests:

```http
Authorization: Bearer YOUR_TOKEN
```

Google login starts in a browser at `GET /api/auth/google`. Register the callback URL in Google Cloud Console exactly as configured in `GOOGLE_CALLBACK_URL`.

## API Documentation

Base URL: `http://localhost:5000/api`

Protected endpoints require a Bearer JWT. Image endpoints use `multipart/form-data` with a file field named `image`. JPEG, PNG, WEBP, and GIF images up to 5 MB are accepted.

### Health

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | No | Check API availability |

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Create an account: `name`, `email`, `password` |
| POST | `/auth/login` | No | Log in: `email`, `password` |
| GET | `/auth/google` | No | Start Google OAuth login |
| GET | `/auth/google/callback` | Google | OAuth callback and frontend redirect |
| POST | `/auth/forgot-password` | No | Request a reset link: `email` |
| POST | `/auth/reset-password` | No | Set a password: `token`, `password` |
| POST | `/auth/logout` | Yes | Log out and discard the client JWT |
| GET | `/auth/me` | Yes | Return the current user |

### Users

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/users/profile` | Yes | Get the current profile |
| PUT | `/users/profile` | Yes | Update profile fields |
| DELETE | `/users/profile` | Yes | Delete the account and associated posts/comments |
| POST | `/users/profile/image` | Yes | Upload a profile image as `image` |
| GET | `/users/suggestions` | Yes | Get suggested users |
| POST | `/users/:handle/follow` | Yes | Follow or unfollow a user |

### Posts

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/posts` | Optional | Get the feed; supports `page` and `limit` |
| GET | `/posts/user/:handle` | Optional | Get posts by a user |
| POST | `/posts` | Yes | Create a post: `text`, optional `image` URL |
| POST | `/posts/image` | Yes | Upload a post image as `image` |
| PUT | `/posts/:id` | Yes, owner | Edit a post |
| DELETE | `/posts/:id` | Yes, owner | Delete a post |
| POST | `/posts/:id/like` | Yes | Like or unlike a post |

### Comments

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/posts/:postId/comments` | No | List comments |
| POST | `/posts/:postId/comments` | Yes | Add a comment: `text` |
| DELETE | `/comments/:id` | Yes, owner | Delete a comment |

## Deployment

Deploy `server` and `client` as separate services. Configure the server with `MONGO_URI`, a long random `JWT_SECRET`, `CLIENT_URL`, Cloudinary variables, and optional Google or SMTP variables.

Set the client build variable to the deployed API base URL, including `/api`:

```env
VITE_API_URL=https://your-api.example.com/api
```

Register the deployed callback URL in Google Cloud Console:

```text
https://your-api.example.com/api/auth/google/callback
```

Build the frontend with `npm run build` and serve `client/dist` as a static site. Rotate any credential that has previously been exposed.
