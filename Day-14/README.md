# Authentication App

A simple authentication application built with Next.js, MongoDB, and JWT.

## Features

- User registration with email, password, confirm password, username, and name
- User login with username and password
- JWT-based authentication
- Protected dashboard page
- MongoDB database integration
- Responsive UI with Tailwind CSS

## Prerequisites

- Node.js (version 18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd day-14
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   MONGODB_URI=mongodb+srv://taniya:taniya@taniya.ni0qzmm.mongodb.net/taniyaa?retryWrites=true&w=majority&appName=taniya
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Registration
1. Navigate to `/register`
2. Fill in all required fields:
   - Full Name
   - Username (must be unique)
   - Email (must be unique)
   - Password (minimum 6 characters)
   - Confirm Password
3. Click "Create account"
4. You'll be redirected to the login page

### Login
1. Navigate to `/login`
2. Enter your username and password
3. Click "Sign in"
4. Upon successful authentication, you'll be redirected to the dashboard

### Dashboard
- Protected page that displays user information
- Shows a personalized greeting with the user's name
- Displays user details (name, username, email)
- Includes a logout button

### Logout
- Click the "Logout" button in the dashboard
- You'll be redirected to the login page
- All authentication cookies will be cleared

## API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/auth/me` - Get current user information

## Database Schema

The application uses MongoDB with the following user document structure:

```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  username: String,
  name: String,
  createdAt: Date
}
```

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens are stored in HTTP-only cookies
- Protected routes are secured with middleware
- Input validation on all forms
- CSRF protection through same-site cookies

## Technologies Used

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Styling**: Tailwind CSS

## Project Structure

```
app/
├── api/
│   ├── auth/
│   │   └── me/
│   │       └── route.js
│   ├── login/
│   │   └── route.js
│   ├── logout/
│   │   └── route.js
│   └── register/
│       └── route.js
├── components/
│   └── Navigation.js
├── dashboard/
│   └── page.js
├── login/
│   └── page.js
├── register/
│   └── page.js
├── globals.css
├── layout.js
└── page.js
lib/
├── auth.js
└── mongodb.js
middleware.js
.env.local
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB URI in `.env.local`
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure the database name is correct

2. **JWT Secret Error**
   - Make sure `JWT_SECRET` is set in `.env.local`
   - The secret should be a strong, random string

3. **Port Already in Use**
   - Change the port in `package.json` scripts
   - Or kill the process using the current port

### Development Tips

- Use the browser's developer tools to monitor network requests
- Check the console for any error messages
- Verify that all environment variables are loaded correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
