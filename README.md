# Scam Radar 🚨

A community-driven platform for reporting and identifying suspicious online activities, projects, and profiles. Built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## 🎯 Features

- **Red Flags Education**: Learn common warning signs and safe practices
- **Community Reports**: Browse verified scam reports from the community
- **Report Submission**: Submit new reports with contact verification
- **Auto-detection**: Automatic title and platform detection from URLs
- **Filtering & Search**: Find reports by type, platform, or keywords
- **Moderation**: Reports are reviewed before publication

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- Firebase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd scam-radar
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Set up Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable Firestore Database
   - Add a web app and copy the configuration values

5. **Start the development server**
   ```bash
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Firebase Configuration

1. Create a new Firebase project
2. Enable Firestore Database
3. Set up security rules for your collections
4. Configure authentication if needed

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to reports
    match /reports/{document} {
      allow read: if true;
      allow write: if true; // You may want to restrict this based on your needs
    }

    // Allow read/write access to users
    match /users/{document} {
      allow read, write: if true; // You may want to restrict this based on your needs
    }
  }
}
```

## 🏗️ Project Structure

```
scam-radar/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page with Red Flags & Advice
│   │   ├── reports/           # Reports listing page
│   │   ├── submit/            # Report submission form
│   │   └── about/             # About page
│   ├── components/            # Reusable UI components
│   │   ├── FormField.tsx      # Form input component
│   │   ├── ReportCard.tsx     # Individual report display
│   │   ├── Filters.tsx        # Search and filter controls
│   │   └── Navigation.tsx     # Main navigation menu
│   └── lib/                   # Utility libraries
│       ├── firebase/          # Firebase configuration and services
│       └── url.ts             # URL parsing utilities
└── package.json               # Dependencies and scripts
```

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 📊 Data Structure

### Users Collection
- `id` - Unique identifier (auto-generated)
- `email` - Email address (optional if LinkedIn provided)
- `linkedin` - LinkedIn profile URL (optional if email provided)
- `name` - Full name
- `expertise` - Professional role/expertise
- `createdAt` - Account creation timestamp

### Reports Collection
- `id` - Unique identifier (auto-generated)
- `type` - Report type (project, profile, company)
- `title` - Auto-detected or manual title
- `url` - Suspicious URL
- `platform` - Auto-detected platform
- `reason` - Why it's suspicious
- `reporterId` - Reference to user who submitted
- `status` - Report status (pending, approved, rejected)
- `createdAt` - Submission timestamp

## 🌐 URL Auto-detection

The platform automatically detects:
- **Title**: Extracted from URL pathname (e.g., `github.com/user/repo` → `repo`)
- **Platform**: Mapped from hostname:
  - `linkedin.com` → LinkedIn
  - `github.com` → GitHub
  - `bitbucket.org` → Bitbucket
  - `x.com/twitter.com` → X/Twitter
  - Others → Other

## 🔒 Security Features

- **Contact Verification**: All reports require email or LinkedIn
- **Moderation**: Reports reviewed before publication
- **RLS**: Database-level access control
- **Input Validation**: Client and server-side validation
- **Privacy**: Reporter information kept confidential

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, focus management
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Interactive Elements**: Hover effects, loading states
- **Form Validation**: Real-time error feedback

## 🚧 MVP Limitations

- **Moderation**: Manual approval via Firebase Console
- **Authentication**: Basic contact verification only
- **Search**: Client-side filtering (no full-text search)
- **Notifications**: No automated approval notifications

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Automated moderation workflows
- [ ] Email notifications
- [ ] Advanced search and analytics
- [ ] API endpoints for external integrations
- [ ] Mobile app
- [ ] Community features (comments, voting)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [Firebase](https://firebase.google.com/)
- Icons from [Heroicons](https://heroicons.com/)

---

**Remember**: This tool is for educational purposes. Always conduct your own research and due diligence before making decisions based on information found here.
