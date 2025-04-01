
# Daily Bible Verses App

A responsive web application for displaying, searching, and sharing Bible verses.

![Bible Verses App Screenshot](./screenshots/app-screenshot.png)

## Features

- Search for Bible verses by reference
- Browse verses by categories
- Get random verses with a click
- Share verses on social media with images
- Save verses as images
- Track recently viewed verses
- Light and dark mode support
- Responsive design for all devices

## Project Structure

The project is built with:
- React + TypeScript
- Vite as the build tool
- TailwindCSS for styling
- Shadcn UI for UI components
- React Router for routing
- HTML2Canvas for image generation

## Local Development

### Prerequisites

- Node.js 16+ and npm installed

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd bible-verses-app
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

## Deploying to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI globally
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

### Option 2: Deploy via GitHub Integration

1. Push your code to a GitHub repository

2. Sign in to [Vercel](https://vercel.com)

3. Click "Add New..." > "Project"

4. Select your GitHub repository

5. Configure your project:
   - Framework Preset: Select "Vite"
   - Build Command: Leave as default (`npm run build`)
   - Output Directory: Leave as default (`dist`)

6. Click "Deploy"

### Important Deployment Considerations

1. **Environment Variables**
   - No environment variables are required for this project

2. **XML Data File**
   - The Bible verses XML file is included in the `/public/data` folder
   - Vercel will automatically serve static files from the public directory

3. **Custom Domain Setup**
   - After deployment, go to your project settings in Vercel
   - Navigate to "Domains"
   - Add your custom domain and follow the DNS configuration instructions

## Customization

### Adding More Bible Verses

To add more verses to the application, edit the XML file at `/public/data/bible-verses.xml`:

```xml
<verse>
  <text>Your new Bible verse text here.</text>
  <reference>Book Chapter:Verse</reference>
  <category>Category1,Category2</category>
</verse>
```

### Modifying Categories

To modify the verse categories, edit the categories array in the `VerseCategories.tsx` component.

## Maintenance

### Updating Dependencies

```bash
npm update
```

### Building for Production Locally

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## License

[MIT License](./LICENSE)

## Contact

For any questions or feedback, please reach out to [John Lorden](https://itsme.johnlorden.online).
