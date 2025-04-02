
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

4. Open your browser and navigate to `http://localhost:8080`

## Deploying to Production

### Option 1: Deploy with CLI

1. Install the deployment CLI globally
   ```bash
   npm install -g vercel
   ```

2. Login to your account
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

2. Sign in to your deployment platform

3. Import your GitHub repository

4. Configure your project:
   - Framework Preset: Select "Vite"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

5. Click "Deploy"

### Important Deployment Settings

1. **Environment Variables**
   - No additional environment variables are required for this project

2. **Build and Development Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Development Command: `npm run dev`
   - Install Command: `npm install`

3. **Optimizing for Production**
   - Enable Auto Minify
   - Use a CDN for global distribution

4. **Custom Domain Setup**
   - After deployment, add your custom domain in the project settings

## Troubleshooting Deployments

If you encounter issues during deployment, try these solutions:

1. **Build Failures**
   - Check the build logs for errors
   - Ensure all dependencies are correctly installed
   - Verify that no environment variables are missing

2. **Static Files Not Loading**
   - Ensure all files in the `public` directory are being properly included
   - The `bible-verses.xml` file must be in the `public/data` directory

3. **Cache Issues**
   - If updates aren't showing, try deploying with cache cleared:
     ```bash
     vercel --prod --force
     ```

## Customization

### Adding More Bible Verses

To add more verses to the application, edit the XML file at `/public/data/bible-verses.xml`:

```xml
<verse>
  <text>Your new Bible verse text here.</text>
  <reference>Book Chapter:Verse</reference>
  <categories>Faith,Love,Wisdom</categories>
</verse>
```

### Adding More Categories

To add new categories, edit the `categories` array in `/src/services/BibleVerseService.ts`.

### Customizing Appearance

The app uses Tailwind CSS for styling. You can customize:

1. **Colors**: Edit the color variables in `tailwind.config.js`
2. **Gradients**: Modify the gradient arrays in `src/components/BibleVerseCard.tsx`
3. **Animations**: Update animation settings in `src/index.css`

## Performance Optimization

This app has been optimized for performance with:

1. **Verse Caching**: Bible verses are cached in memory for faster display
2. **Preloading**: Categories are preloaded in the background
3. **Code Splitting**: Components are organized efficiently
4. **Image Optimization**: Images are generated at optimal quality
5. **Animation Performance**: Hardware-accelerated animations with Framer Motion

## License

[MIT License](./LICENSE)

## Contact

For any questions or feedback, please reach out to [John Lorden](https://itsme.johnlorden.online).
