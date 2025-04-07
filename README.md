
# God's Daily Bread - Bible Verses App

A responsive web application that delivers daily Bible verses, allows searching by reference, and sharing on social media.

![Bible Verses App Screenshot](./public/ogimage.jpg)

## Features

- Search for Bible verses by reference
- Browse verses by categories
- Get random verses with a single click
- Display verses with beautiful, dynamically changing gradients
- Share verses on social media with images
- Download verses as images
- Track recently viewed verses
- Light and dark mode support
- Fully responsive design for all devices
- URL-based verse sharing
- Partner organizations showcase
- Multi-language support
- Offline mode for using the app without internet

## Technology Stack

The project is built with:
- React + TypeScript
- Vite as the build tool
- TailwindCSS for styling
- Shadcn UI for UI components
- Framer Motion for animations
- React Router for routing
- HTML2Canvas for image generation
- XML for verse storage
- Supabase for backend storage

## Local Development

### Prerequisites

- Node.js 16+ and npm installed

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd gods-daily-bread
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/        # UI components
│   ├── home/          # Home page specific components
│   └── ui/            # Shadcn UI components
├── hooks/             # Custom React hooks
├── integrations/      # External integrations like Supabase
├── pages/             # Page components
├── services/          # Service layer for data fetching & business logic
│   └── utils/         # Utility functions for services
├── types/             # TypeScript types and interfaces
└── utils/             # Utility functions
```

## Deployment

### Option 1: Deploy with CLI (Vercel)

1. Install the Vercel CLI globally
   ```bash
   npm install -g vercel
   ```

2. Login to your Vercel account
   ```bash
   vercel login
   ```

3. Deploy from the project directory
   ```bash
   vercel
   ```

4. To deploy to production
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Dashboard (Recommended)

1. Push your code to a GitHub repository
2. Sign in to your deployment platform (Vercel, Netlify, etc.)
3. Import your GitHub repository
4. Configure your project:
   - Framework Preset: Select "Vite"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Development Command: `npm run dev`
5. Click "Deploy"

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](./LICENSE)

## Contact

For any questions or feedback, please reach out to [John Lorden](https://itsme.johnlorden.online).
