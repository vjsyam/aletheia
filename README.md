# Aletheia - AI Ethics Platform

A comprehensive, multi-page web application that explores AI ethics through interactive philosophical dilemmas. Built with Next.js 15, TypeScript, and modern web technologies.

## 🌟 Features

### Core Functionality
- **Interactive Dilemma Analysis**: Present ethical scenarios to three AI philosophers (Utilitarian, Deontologist, Virtue Ethicist)
- **Multi-Page Architecture**: Comprehensive platform with dedicated sections for different use cases
- **Modern UI/UX**: Dark theme with glassmorphism effects and smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Pages & Sections

#### 🧠 Dilemmas (Home)
- Classic ethical dilemmas (Trolley Problem, Lifeboat, etc.)
- Custom dilemma creation
- Real-time AI analysis with three philosophical perspectives
- Interactive response comparison

#### 📚 Library
- Curated collection of ethical dilemmas
- Category-based browsing (Classic Ethics, AI Ethics, Medical Ethics, etc.)
- Search and filtering capabilities
- Difficulty ratings and tags

#### 📊 Analytics Dashboard
- User engagement metrics
- Popular dilemmas tracking
- Philosophy usage statistics
- Interactive charts and visualizations
- Time-based filtering

#### 👥 Community
- User discussions and forums
- Shared dilemma submissions
- Community engagement metrics
- Hot topics and trending discussions

#### ⚙️ Settings
- User profile management
- Notification preferences
- Privacy and security controls
- Theme customization
- Language and regional settings

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aletheia.git
   cd aletheia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini API (for real AI analysis)
GOOGLE_GEMINI_API_KEY=your_api_key_here

# Optional: Analytics tracking
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home/Dilemmas page
│   ├── library/           # Library page
│   ├── analytics/         # Analytics dashboard
│   ├── community/         # Community features
│   ├── settings/          # User settings
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   └── Navigation.tsx     # Main navigation
└── lib/                   # Utility functions
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#007BFF)
- **Background**: Dark gray (#121212)
- **Text**: Light gray (#EAEAEA)
- **Philosopher Colors**:
  - Utilitarian: Cyan (#00FFFF)
  - Deontologist: Magenta (#FF00FF)
  - Virtue Ethics: Yellow (#FFD700)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

### Components
- Glassmorphism cards with backdrop blur
- Smooth hover animations
- Responsive grid layouts
- Custom form controls

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npx tsc --noEmit     # Check TypeScript types
```

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Prettier formatting (recommended)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms
The app is compatible with any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Test on multiple devices and browsers
- Ensure responsive design works correctly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Philosophical Framework**: Based on classical ethical theories
- **Design Inspiration**: Modern web design principles and accessibility standards
- **Icons**: Lucide React icon library
- **Charts**: Recharts for data visualization

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/aletheia/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/aletheia/discussions)
- **Email**: support@aletheia-ai.com

## 🔮 Roadmap

### Phase 2 Features
- [ ] Real AI integration with Google Gemini
- [ ] User authentication and profiles
- [ ] Advanced analytics and insights
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

### Phase 3 Features
- [ ] Multi-language support
- [ ] Advanced dilemma creation tools
- [ ] Educational content and courses
- [ ] Community moderation tools
- [ ] Enterprise features

---

**Aletheia** - Exploring the truth of AI ethics through philosophical inquiry.
