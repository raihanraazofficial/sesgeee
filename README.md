# SESGRG - Sustainable Energy & Smart Grid Research Website

A comprehensive research website for the Sustainable Energy and Smart Grid Research Group (SESGRG) at BRAC University.

## Features

### Public Website
- **Home Page**: Hero section, About Us, Objectives, Research Areas, Latest News, Photo Gallery
- **People**: Advisors, Team Members, Collaborators with detailed profiles
- **Research Areas**: 7 research domains with detailed information pages
- **Publications**: IEEE-styled citations with search and filtering
- **Projects**: Research project showcase with categorization
- **Achievements**: Awards, recognitions, and milestones
- **News & Events**: Blog-style articles with event calendar
- **Contact**: Contact form and location information
- **Photo Gallery**: Railway-style scrolling image gallery

### Admin Panel
- **Dashboard**: Statistics and quick actions
- **Content Management**: Real-time CRUD operations for all content types
- **User Management**: Different permission levels
- **Rich Text Editor**: WordPress-style editor with LaTeX support
- **Settings**: Professional configuration options

### Technical Features
- **Firebase Integration**: Real-time database and authentication
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live content synchronization
- **SEO Optimized**: Meta tags and structured data
- **Performance Optimized**: Lazy loading and code splitting

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Firebase SDK
- React Quill (Rich Text Editor)
- React Calendar
- KaTeX (Mathematical formulas)
- Lucide React (Icons)
- React Toastify (Notifications)

### Backend
- FastAPI
- Firebase Admin SDK
- Python-Jose (JWT)
- Passlib (Password hashing)
- Python-multipart
- Uvicorn

### Database
- Firebase Firestore (Real-time database)
- Firebase Storage (File storage)
- Firebase Authentication

## Installation & Setup

### Prerequisites
- Node.js 16+
- Python 3.9+
- Firebase Project

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sesgrg-website
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   yarn install
   ```

3. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   
   Create `.env` files in both frontend and backend directories:
   
   **Frontend (.env)**
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
   
   **Backend (.env)**
   ```
   MONGO_URL=mongodb://localhost:27017/sesgrg_db
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=@dminsesg705
   SECRET_KEY=your-secret-key
   FIREBASE_PROJECT_ID=your_project_id
   ```

5. **Start Development Servers**
   ```bash
   # Backend (Terminal 1)
   cd backend
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   
   # Frontend (Terminal 2)
   cd frontend
   yarn start
   ```

## Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Configure environment variables
   - Deploy automatically

### Environment Variables for Production
Set these in your Vercel dashboard:

```
REACT_APP_BACKEND_URL=/api
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
ADMIN_USERNAME=admin
ADMIN_PASSWORD=@dminsesg705
SECRET_KEY=your-production-secret-key
FIREBASE_PROJECT_ID=your_project_id
```

## Admin Access

**Default Credentials:**
- Username: `admin`
- Password: `@dminsesg705`

Access the admin panel at: `/admin/login`

## Project Structure

```
sesgrg-website/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── public/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env
├── vercel.json
└── README.md
```

## Key Features Implementation

### 1. Firebase Integration
- Real-time database with Firestore
- Authentication for admin panel
- File storage for images and documents

### 2. Admin Panel
- JWT-based authentication
- Role-based access control
- Real-time content management

### 3. Rich Text Editor
- WordPress-style editing experience
- LaTeX support for mathematical formulas
- Media embedding capabilities

### 4. Railway-style Photo Gallery
- CSS animations for continuous scrolling
- Hover effects and image overlays
- Responsive grid layout

### 5. IEEE-styled Publications
- Proper citation formatting
- Advanced search and filtering
- Real-time statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, contact:
- Email: sesg@bracu.ac.bd
- Website: [SESGRG](https://sesgrg.vercel.app)

## Acknowledgments

- BRAC University
- BSRM School of Engineering
- Sustainable Energy Research Community