🌟 Resolution Club Website

A modern, responsive, and fully manageable website for **Resolution** — a college media club focused on photography, videography, and visual storytelling.

This project aims to create a visually engaging digital platform that showcases the club’s events, creative work, members, and achievements while providing a powerful admin panel for easy content management.



 🎯 Project Goal

Build a fully functional website that:

- Showcases Resolution’s creative identity
- Displays events, galleries, and member portfolios
- Simplifies recruitment and engagement
- Enables non-technical members to manage content independently
- Provides a smooth responsive experience across all devices



 ✨ Dashboards

 🏠 Home Page
- Hero section with cinematic visuals
- Intro about the club
- Featured events/projects
- Scroll animations
- Call-to-action buttons

 ℹ️ About Page
- Club story
- Vision & mission
- Core values
- Timeline of achievements

 📅 Events Page
- Upcoming & past events
- Event categories and filters
- Event detail pages
- Photo galleries

 👥 Team Page
- Team member cards
- Role-based filtering
- Member profiles
- Academic year labels

 📞 Contact Page
- Contact form
- Social media links
- FAQ section (optional)



 🔐 Admin Panel Features

 📌 Event Management
- Add/edit/delete events
- Upload galleries
- Categorise events
- Mark events as past/upcoming

 👤 Member Management
- Add/edit team members
- Archive previous members
- Drag-and-drop ordering

 📩 Contact Request Management
- View contact submissions
- Mark requests as resolved/pending
- Remove spam entries

 📝 Content Management
- Edit homepage content
- Update About page
- Upload banners/announcements


 🎨 Design Principles

- Minimal and modern UI
- Media-focused layouts
- Smooth animations
- Mobile-first responsiveness
- Clean admin experience for non-technical users



 📱 Responsiveness Strategy

 Device         Layout 

 Mobile        Single-column layout, hamburger navigation 
 Tablet        Two-column responsive grids 
 Desktop       Full-width galleries and multi-column sections 


 🛡️ Security Practices

- Password hashing using bcrypt
- JWT Authentication
- Protected admin routes
- File upload validation
- Input sanitisation
- HTTPS enforcement
- CORS protection





 📁 Project Structure

```bash
resolution-club-website/
│
├── app/
│   ├── dashboard/
│   ├── about/
│   ├── events/
│   ├── team/
│   ├── contact/
│   ├── admin/
│   └── layout.js
│
├── components/
│   ├── navbar/
│   ├── footer/
│   ├── cards/
│   ├── events/
│   ├── team/
│   └── common/
│
├── public/
│   ├── images/
│   ├── videos/
│   ├── icons/
│   └── logos/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── config/
│
├── lib/
├── hooks/
├── context/
├── styles/
├── docs/
└── README.md
```



⚙️ Installation

 Clone Repository

```bash
git clone https://github.com/your-username/resolution-club-website.git
cd resolution-club-website




 Install Dependencies

```bash
npm install




 Setup Environment Variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_API_KEY=
```


▶️ Run Development Server

```bash
npm run dev
```



 🚀 Future Enhancements

- AI-powered gallery tagging
- Event registration system
- Admin analytics dashboard
- Certificate generation
- Media upload optimisation
- Notification system



 🤝 Contributors

Developed collaboratively by the ExploitX Team.



 📜 License

This project is developed for educational and organizational purposes.



 🌟 Resolution

Capturing creativity. Building stories. Inspiring people.
