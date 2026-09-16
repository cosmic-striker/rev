# Resolution Club Website

A modern, responsive, and fully manageable website for **Resolution** — a college media club focused on photography, videography, and visual storytelling.

## Project Goal

Build a fully functional website that:

- Showcases Resolution's creative identity
- Displays events, galleries, and member portfolios
- Simplifies recruitment and engagement
- Enables non-technical members to manage content independently
- Provides a smooth responsive experience across all devices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Backend | Express.js |
| Database | MongoDB (Mongoose) |
| Language | TypeScript |
| Authentication | JWT + bcrypt |
| Media Storage | Cloudinary |

## Features

### Public Pages

- **Home** — Hero section with cinematic visuals, featured events, call-to-action buttons
- **About** — Club story, vision, mission, core values, timeline of achievements
- **Events** — Upcoming and past events, event categories and filters, photo galleries
- **Team** — Team member cards, role-based filtering, member profiles, academic year labels
- **Contact** — Contact form, social media links

### Admin Panel

- **Event Management** — Add, edit, delete events; upload galleries; categorize events; mark as past/upcoming
- **Member Management** — Add, edit team members; archive previous members; drag-and-drop ordering
- **Contact Request Management** — View contact submissions; mark as resolved/pending; remove spam entries
- **Content Management** — Edit homepage content; update About page; upload banners and announcements

## Project Structure

```
resolution-club-website/
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # Reusable components
│   │   ├── lib/               # Utility functions
│   │   ├── hooks/             # Custom React hooks
│   │   └── styles/            # Global styles
│   └── public/                # Static assets
├── server/                    # Express.js backend
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   └── config/            # Database, env config
│   └── package.json
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
└── package.json               # Root package with workspace scripts
```

## Installation

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone the repository

```bash
git clone https://github.com/ExploitX-org/Resolution-Webpage.git
cd Resolution-Webpage
```

2. Install dependencies

```bash
npm run install:all
```

3. Create environment file

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/resolution
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

5. Start development servers

```bash
npm run dev
```

This runs both the client (http://localhost:3000) and server (http://localhost:5000) concurrently.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `JWT_EXPIRES_IN` | Token expiration duration | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `CLIENT_URL` | Frontend URL for CORS | Yes |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create admin account |
| POST | `/api/auth/login` | Admin login |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event (admin) |
| PUT | `/api/events/:id` | Update event (admin) |
| DELETE | `/api/events/:id` | Delete event (admin) |

### Team

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/team` | Get all members |
| GET | `/api/team/:id` | Get single member |
| POST | `/api/team` | Add member (admin) |
| PUT | `/api/team/:id` | Update member (admin) |
| DELETE | `/api/team/:id` | Remove member (admin) |

### Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contact` | Get submissions (admin) |
| POST | `/api/contact` | Submit contact form |
| PATCH | `/api/contact/:id` | Update status (admin) |
| DELETE | `/api/contact/:id` | Delete submission (admin) |

## Security Practices

- Password hashing using bcrypt
- JWT authentication for protected routes
- Protected admin routes
- File upload validation
- Input sanitization
- HTTPS enforcement (production)
- CORS protection

## Responsiveness

| Device | Layout |
|--------|--------|
| Mobile | Single-column layout, hamburger navigation |
| Tablet | Two-column responsive grids |
| Desktop | Full-width galleries and multi-column sections |

## Future Enhancements

- AI-powered gallery tagging
- Event registration system
- Admin analytics dashboard
- Certificate generation
- Media upload optimization
- Notification system

## Contributors

Developed collaboratively by the ExploitX Team.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Resolution** — Capturing creativity. Building stories. Inspiring people.
