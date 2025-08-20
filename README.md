feel free to interact with this program by clicking on the URL

# SeaClear Frontend

A React-based web application for monitoring beach water quality in Cape Town, South Africa. This application provides real-time water quality information, community discussions, and administrative tools for managing beach safety data.

🌊 **Live Demo**: [SeaClear Water Quality Monitor](https://papaya-yeot-5ff93c.netlify.app)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### 🏖️ Public Features
- **Interactive Beach Map**: View all Cape Town beaches with real-time water quality status
- **Beach Details**: Detailed information including enterococcus levels, safety status, and weather
- **Water Quality Indicators**: Color-coded safety levels (Safe/Caution/Unsafe)
- **Community Posts**: Beach-specific user discussions and experiences
- **Educational Content**: Learn about water quality and beach safety
- **AI Chatbot**: Groq-powered assistant for beach safety questions
- **Responsive Design**: Mobile-first design that works on all devices

### 🔧 Admin Features
- **Post Moderation**: Review and approve/reject community posts
- **Beach Data Management**: Edit beach information and water quality readings
- **PDF Upload**: Parse water quality reports from City of Cape Town
- **Dashboard Analytics**: Overview of system status and recent activity
- **Automated Moderation**: AI-powered content filtering

## 🛠 Technology Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Leaflet** - Interactive maps
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Groq AI** - Chatbot intelligence
- **Netlify** - Hosting and deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/seaclear-frontend.git
cd seaclear-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview  # Preview production build locally
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=https://waterqualityapi20250812142739.azurewebsites.net

# External APIs
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_GROQ_API_KEY=your_groq_api_key

# Gemini AI (for beach descriptions)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Environment
VITE_ENVIRONMENT=development
```

### Required API Keys

- **OpenWeather API**: For weather data - [Get API Key](https://openweathermap.org/api)
- **Groq API**: For AI chatbot - [Get API Key](https://console.groq.com)
- **Gemini API**: For beach descriptions - [Get API Key](https://makersuite.google.com)

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── BeachCard.jsx    # Beach information cards
│   ├── Header.jsx       # Navigation header
│   ├── Sidebar.jsx      # Admin sidebar
│   └── SeaClearChatbot.jsx # AI assistant
├── pages/               # Route components
│   ├── HomePage.jsx     # Main landing page
│   ├── BeachDetailsPage.jsx # Individual beach info
│   ├── CommunityPage.jsx # Community discussions
│   ├── EducationalContentPage.jsx # Learning resources
│   ├── LoginPage.jsx    # Admin authentication
│   └── admin/           # Admin-only pages
│       ├── AdminDashboard.jsx
│       ├── PostsContent.jsx
│       ├── BeachesContent.jsx
│       └── UploadContent.jsx
├── services/            # API and external services
│   ├── api.js          # Backend API calls
│   ├── beachService.js # Beach data management
│   └── geminiService.js # AI descriptions
├── hooks/               # Custom React hooks
│   ├── useAuth.js      # Authentication logic
│   └── useBeachData.js # Beach data fetching
├── utils/               # Utility functions
│   └── formatters.js   # Data formatting helpers
├── styles/              # CSS files
│   └── BeachDetails.css # Component-specific styles
└── App.jsx             # Main application component
```

## 🧩 Key Components

### BeachCard Component
Displays beach information with safety status, water quality, and recent measurements.

```jsx
<BeachCard 
  beach={beachData}
  onSelect={handleBeachSelection}
  image={customImage}
  waterQuality="Safe"
/>
```

### SeaClearChatbot
AI-powered assistant using Groq API for beach safety questions.

Features:
- Real-time responses about water quality
- Cape Town beach recommendations  
- Safety guidelines and tips
- Rate limiting and error handling

### BeachDetailsPage
Comprehensive beach information including:
- Interactive Leaflet map
- Current weather conditions
- Water quality history
- Community posts section
- AI-generated descriptions

## 🔌 API Integration

### Backend Integration
The app connects to a .NET Core API hosted on Azure:

```javascript
const API_URL = "https://waterqualityapi20250812142739.azurewebsites.net";

// Example API calls
const beaches = await beachesApi.getAllBeaches();
const posts = await communityApi.getPostsByBeach(beachCode);
```

### Key API Endpoints
- `GET /beach` - Fetch all beaches
- `GET /beach/{code}` - Get specific beach data
- `GET /api/Community?beachCode={code}` - Get community posts
- `POST /api/Community` - Submit new community post
- `POST /upload` - Upload and parse PDF reports (admin)

### Water Quality Thresholds
- **Safe**: < 250 cfu/100ml (Green)
- **Caution**: 250-500 cfu/100ml (Yellow)  
- **Unsafe**: > 500 cfu/100ml (Red)

## 🚀 Deployment

### Netlify Deployment (Current)

1. **Connect Repository**
   - Link your GitHub repository to Netlify
   - Enable automatic deployments

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   Add all required environment variables in Netlify dashboard

4. **Deploy**
   - Automatic deployment on git push
   - Preview deployments for pull requests

### Alternative Deployment Options

**Vercel**
```bash
npm run build
npx vercel --prod
```

**Azure Static Web Apps**
```bash
npm run build
# Deploy via Azure CLI or GitHub Actions
```

## 🛡️ Security Features

- **Input Validation**: All user inputs are sanitized
- **Rate Limiting**: API calls are throttled to prevent abuse
- **Content Moderation**: Admin approval required for posts
- **CORS Protection**: Configured for allowed origins only
- **Environment Variables**: Sensitive data stored securely

## 🧪 Testing

### Run Tests
```bash
npm run test          # Run unit tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

### Testing Strategy
- Component unit tests with React Testing Library
- API integration tests with MSW (Mock Service Worker)
- E2E testing with Playwright (planned)

## 📱 Mobile Responsiveness

The application is built mobile-first with:
- Responsive grid layouts
- Touch-friendly interactions
- Optimized map controls for mobile
- Collapsible navigation menu
- Progressive Web App capabilities (planned)

## 🔄 State Management

- **React Hooks**: useState, useEffect for local state
- **Custom Hooks**: Reusable logic for auth and data fetching
- **Context API**: Planned for global state (user preferences)
- **Local Storage**: Persist admin authentication

## 🎨 Styling Guidelines

### Tailwind CSS Classes
- Primary colors: `cyan-600`, `blue-700`
- Status colors: `green-600` (safe), `yellow-600` (caution), `red-600` (unsafe)
- Spacing: Consistent `4`, `6`, `8` unit spacing
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`

### Component Styling
```jsx
// Example styling pattern
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Title</h3>
  <p className="text-gray-600">Content</p>
</div>
```

## 🐛 Error Handling

### Frontend Error Handling
- Try-catch blocks for async operations
- User-friendly error messages
- Fallback UI components
- Retry mechanisms for failed requests

### API Error Responses
```javascript
try {
  const data = await api.fetchBeaches();
} catch (error) {
  if (error.response?.status === 404) {
    setError("Beach not found");
  } else {
    setError("Unable to load beach data. Please try again.");
  }
}
```

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading of admin components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Regular monitoring of bundle size
- **Caching**: Service worker for offline functionality (planned)
- **CDN**: Optimized asset delivery via Netlify

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Make changes and test**
4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add beach search functionality"
   ```
5. **Push and create Pull Request**

### Commit Convention
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/seaclear-frontend/issues)
- **Documentation**: Check the [Wiki](https://github.com/yourusername/seaclear-frontend/wiki)
- **Email**: support@seaclear.co.za

## 🔮 Roadmap

### Short Term
- [ ] Offline functionality with service workers
- [ ] Push notifications for water quality alerts  
- [ ] Advanced filtering and search
- [ ] User profiles and favorites

### Long Term
- [ ] Mobile app with React Native
- [ ] Advanced analytics dashboard
- [ ] Machine learning predictions
- [ ] Integration with more data sources

---

**Built with ❤️ for Cape Town beach safety**
