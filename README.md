# V-Verify

A full-stack web application for user authentication with OTP verification and submission management. Features a modern React frontend with TypeScript and a Node.js/Express backend with MongoDB.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS with PostCSS
- **Routing**: React Router
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: React Query (TanStack Query)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **Email**: Nodemailer
- **Environment**: dotenv

## Project Structure

```
v-verify/
├── src/                          # Frontend source
│   ├── components/              # React components
│   │   ├── ui/                 # Shadcn/ui components
│   │   ├── ContactForm.tsx
│   │   ├── HeroSlider.tsx
│   │   └── ...                 # Other page components
│   ├── pages/                   # Page components
│   │   ├── Index.tsx           # Home page
│   │   ├── Login.tsx           # Login page
│   │   ├── VerifyOtp.tsx       # OTP verification
│   │   ├── AdminPanel.tsx      # Admin dashboard
│   │   ├── Profile.tsx         # User profile
│   │   └── NotFound.tsx        # 404 page
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities
│   └── App.tsx                  # Main app component
│
├── server/                       # Backend source
│   ├── index.js                # Express server entry
│   ├── routes/                 # API routes
│   │   ├── auth.js            # Authentication endpoints
│   │   └── submissions.js      # Submission endpoints
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js            # User model
│   │   └── Submission.js       # Submission model
│   ├── middleware/             # Express middleware
│   │   └── auth.js            # Authentication middleware
│   ├── utils/                  # Utilities
│   │   └── mailer.js          # Email sending
│   └── package.json
│
├── package.json                 # Frontend dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind CSS config
└── tsconfig.json               # TypeScript config
```

## Features

- **User Authentication**: Email-based login with JWT tokens
- **OTP Verification**: Two-factor authentication via email
- **Admin Panel**: Dashboard for managing submissions
- **User Profile**: Profile management and viewing
- **Form Submission**: Contact form with validation
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Modern UI**: Component library with accessible shadcn/ui

## Getting Started

### Prerequisites
- Node.js >= 16
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd v-verify

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=mongodb://localhost:27017/v-verify
PORT=4000
JWT_SECRET=your_jwt_secret_key
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Running the Application

#### Frontend (from root directory)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

#### Backend (from server directory)
```bash
cd server
npm run dev          # Start with nodemon (auto-reload)
# or
npm start            # Start production server
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:4000`.

## API Routes

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /verify-otp` - Verify OTP
- `POST /register` - User registration
- `GET /profile` - Get user profile (requires JWT)

### Submissions (`/api/submissions`)
- `GET /` - Get all submissions (admin only)
- `POST /` - Create new submission
- `GET /:id` - Get submission by ID
- `PUT /:id` - Update submission
- `DELETE /:id` - Delete submission

## Development

- **Linting**: `npm run lint` (ESLint)
- **Type Checking**: TypeScript enabled by default
- **Database**: MongoDB with Mongoose ODM
- **Hot Reload**: Vite + Nodemon for automatic reloading

## License

This project is licensed under the MIT License.
