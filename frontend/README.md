# OC Profile Frontend

Modern character profile website built with React 18, TypeScript, Vite, and Tailwind CSS.

## 🎨 Design Features

- **Dark Theme**: Beautiful dark UI with sakura-pink accents
- **Glassmorphism**: Modern glass-style cards with backdrop blur
- **Responsive**: Mobile-first design that works on all devices
- **Smooth Animations**: Elegant transitions and hover effects
- **Sakura Glow**: Pink neon glow effects on borders and highlights

## 🚀 Tech Stack

- **Framework**: React 18.2+
- **Build Tool**: Vite 5+
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3.4+
- **Routing**: React Router 6+
- **HTTP Client**: Axios 1.6+

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Card.tsx
│   │   ├── Tag.tsx
│   │   ├── Section.tsx
│   │   ├── CharacterProfileCard.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── ErrorMessage.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── CharacterPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── characterService.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── netlify.toml
└── package.json
```

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

For production (Netlify):
```env
VITE_API_URL=https://your-render-api.onrender.com/api
```

### 3. Run Development Server

```bash
npm run dev
```

App will run on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## 🎨 UI Components

### CharacterProfileCard

Main component displaying character information:
- Large avatar image with glow effect
- Character name and ID
- Message count badge
- Creator information
- About and backstory sections
- Tag list

### Card

Reusable glassmorphism card component:
```tsx
<Card hover className="p-4">
  {/* Your content */}
</Card>
```

### Tag

Styled tag component:
```tsx
<Tag variant="sakura">Xianxia</Tag>
```

### Section

Section wrapper with title:
```tsx
<Section title="About">
  <p>Character description...</p>
</Section>
```

## 🎯 Pages

### HomePage (/)

- Character gallery grid
- Search functionality
- Pagination
- Loading skeleton
- Error handling

### CharacterPage (/character/:id)

- Full character profile
- Back navigation
- Loading states
- Error handling

### NotFoundPage (404)

- Custom 404 page
- Navigate back to home

## 🌐 Deployment to Netlify

### Method 1: Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

### Method 2: GitHub + Netlify Dashboard

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-render-api.onrender.com/api`
7. Click "Deploy site"

### Update Environment Variables

After deployment, update `.env` for local development to point to your production API.

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```js
colors: {
  sakura: {
    500: '#ff2d7a', // Change primary sakura color
    // ...other shades
  }
}
```

### Theme

Edit `src/index.css` for global styles:
- Glassmorphism effects
- Sakura glow
- Gradients
- Animations

## 🐛 Troubleshooting

### API Connection Error

```
✅ Check VITE_API_URL in .env
✅ Ensure backend is running
✅ Check CORS configuration on backend
```

### Build Errors

```
✅ Delete node_modules and reinstall
✅ Clear Vite cache: rm -rf node_modules/.vite
✅ Check TypeScript errors: npm run lint
```

### Netlify Deploy Failed

```
✅ Check build command in netlify.toml
✅ Verify Node version (20+)
✅ Check environment variables in Netlify dashboard
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 📄 License

MIT
