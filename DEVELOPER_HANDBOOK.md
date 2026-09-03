# Confab - Developer Handbook

A personal project for a social media app created for study purposes, intentionally using industry-grade libraries to learn best practices and advanced development patterns.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Directory Structure](#directory-structure)
3. [Environment Variables](#environment-variables)
4. [Setup Instructions](#setup-instructions)
5. [Development Workflow](#development-workflow)
6. [Project Architecture](#project-architecture)
7. [Key Libraries & Tools](#key-libraries--tools)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)

---

## Tech Stack

### Frontend Framework & Build
- **React 19.2.8** - UI library for building interactive user interfaces
- **Vite 8.2.2** - Next-generation frontend build tool with Hot Module Replacement (HMR)
- **React Router DOM 7.18.3** - Client-side routing and navigation
- **React DOM 19.2.8** - React package for working with the DOM

### State Management
- **Redux Toolkit 2.12.0** - Predictable state container with simplified Redux setup
- **React-Redux 9.3.0** - Official React bindings for Redux

### Styling
- **Tailwind CSS 4.3.3** - Utility-first CSS framework
- **Tailwind CSS Vite 4.3.3** - Vite plugin for Tailwind CSS integration

### Backend & Database
- **Appwrite 26.2.0** - Open-source backend-as-a-service platform
  - User authentication
  - Database operations
  - File storage

### Form Handling & Validation
- **React Hook Form 7.87.0** - Performant, flexible form library with easy validation

### Rich Text Editor
- **TinyMCE React 6.3.0** - Rich text editor for content creation
- Requires TinyMCE API key

### Utilities
- **HTML React Parser 6.1.7** - Parse HTML strings into React components

### Development & Linting
- **ESLint 10.9.1** - JavaScript linter for code quality
- **ESLint Plugin React Hooks 7.1.1** - Linting rules for React Hooks
- **ESLint Plugin React Refresh 0.5.6** - Support for React Fast Refresh

---

## Directory Structure

```
Confab/
├── src/
│   ├── components/              # Reusable React components
│   │   ├── index.js            # Component exports barrel file
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Footer.jsx          # Footer component
│   │   ├── Container/
│   │   │   └── Container.jsx   # Layout container
│   │   ├── Button.jsx          # Reusable button component
│   │   ├── Input.jsx           # Reusable input component
│   │   ├── Select.jsx          # Select dropdown component
│   │   ├── FormField.jsx       # Form field wrapper
│   │   ├── RTE.jsx             # Rich Text Editor component
│   │   ├── PostCard.jsx        # Blog post card display
│   │   ├── post-form/
│   │   │   └── Postform.jsx    # Post creation/edit form
│   │   ├── Login.jsx           # Login component
│   │   ├── signup.jsx          # Signup component
│   │   ├── LogoutBtn.jsx       # Logout button
│   │   └── AuthLayout.jsx      # Protected/auth wrapper
│   │
│   ├── pages/                  # Page-level components
│   │   ├── Home.jsx            # Homepage (displays all posts)
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Signup page
│   │   ├── AllPost.jsx         # All posts listing
│   │   ├── AddPost.jsx         # Post creation page
│   │   ├── EditPost.jsx        # Post editing page
│   │   └── Post.jsx            # Single post view
│   │
│   ├── store/                  # Redux store and slices
│   │   ├── store.js            # Redux store configuration
│   │   └── authslice.js        # Authentication state slice
│   │
│   ├── appwrite/               # Appwrite backend services
│   │   ├── auth.js             # Authentication service class
│   │   └── config.js           # Database and storage service class
│   │
│   ├── App.jsx                 # Root app component
│   ├── App.css                 # App styles
│   ├── main.jsx                # React entry point with routing
│   ├── index.css               # Global styles
│   └── conf.js                 # Environment config loader
│
├── public/                     # Static assets
│   └── favicon.svg
│
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── .eslintrc.js                # ESLint configuration
├── package.json                # Project dependencies
├── package-lock.json           # Dependency lock file
├── .gitignore                  # Git ignore rules
└── DEVELOPER_HANDBOOK.md       # This file
```

---

## Environment Variables

Create a `.env` file in the root directory (same level as `package.json`) with the following variables:

### Appwrite Configuration
```env
VITE_APPWRITE_ENDPOINT=https://your-appwrite-instance.com/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_PROJECT_NAME=Confab
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
```

### TinyMCE Configuration
```env
VITE_TINYMCE_API_KEY=your_tinymce_api_key
```

### Environment Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APPWRITE_ENDPOINT` | Appwrite server endpoint | `https://appwrite.example.com/v1` |
| `VITE_APPWRITE_PROJECT_ID` | Appwrite project identifier | `project_123abc` |
| `VITE_APPWRITE_PROJECT_NAME` | Project display name | `Confab` |
| `VITE_APPWRITE_DATABASE_ID` | Appwrite database ID | `db_456def` |
| `VITE_APPWRITE_COLLECTION_ID` | Posts collection in database | `collection_789ghi` |
| `VITE_APPWRITE_BUCKET_ID` | Storage bucket for images | `bucket_012jkl` |
| `VITE_TINYMCE_API_KEY` | TinyMCE cloud API key | Available from tinymce.com |

**Note:** Variables prefixed with `VITE_` are exposed to the frontend. Ensure no sensitive data is stored here.

---

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn installed
- Git installed
- An Appwrite instance (self-hosted or cloud)
- TinyMCE API key (free tier available at tinymce.com)

### Step 1: Clone the Repository
```bash
git clone https://github.com/akalp-mishra/Confab.git
cd Confab/Confab
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs all required packages from `package.json`.

### Step 3: Configure Environment Variables
```bash
# Copy the example env file (if it exists)
cp .env.example .env

# Or create .env manually with the variables listed above
nano .env
```

Fill in all required Appwrite and TinyMCE credentials.

### Step 4: Set Up Appwrite Backend
1. **Start Appwrite** (if self-hosted):
   ```bash
   docker-compose up
   ```
   Then access the console at `http://localhost/console`

2. **Create a Database and Collection**:
   - Create a new database
   - Create a collection with the following attributes:
     - `title` (String, required)
     - `content` (String, required)
     - `featured_image` (String)
     - `user_id` (String, required)
     - `status` (String)

3. **Create a Storage Bucket** for post images

4. **Copy IDs** to your `.env` file

### Step 5: Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Step 6: Build for Production
```bash
npm run build
```

Output files will be in the `dist/` directory.

### Step 7: Preview Production Build
```bash
npm run preview
```

---

## Development Workflow

### Run Development Server
```bash
npm run dev
```
- Starts Vite dev server with Hot Module Replacement
- Any changes to source files automatically refresh the browser

### Run ESLint
```bash
npm run lint
```
- Checks code quality and style
- Fix some issues automatically:
  ```bash
  npm run lint -- --fix
  ```

### Build for Production
```bash
npm run build
```
- Minifies and optimizes code
- Creates optimized bundle in `dist/` folder

### Preview Production Build Locally
```bash
npm run preview
```
- Serves the production build for testing

---

## Project Architecture

### Component Architecture
```
App (Root)
├── Header (Navigation)
├── <Outlet /> (Page Routes)
│   ├── Home (List all posts)
│   ├── Login/Signup (Auth pages)
│   ├── AllPost (Post listing)
│   ├── AddPost (Create new post)
│   ├── EditPost (Modify existing post)
│   └── Post (View single post)
└── Footer
```

### State Management Flow
```
Redux Store
├── auth slice
│   ├── isAuthenticated (boolean)
│   └── userdata (object)
│
Components dispatch actions
└── App checks session on mount → login/logout
```

### Authentication Flow
1. App mounts and checks for existing session
2. `AuthService.getCurrentUser()` returns user or null
3. Dispatch `login(userData)` or `logout()` action
4. Update Redux state
5. Conditional rendering based on `isAuthenticated`

### Data Flow (Posts)
1. User creates/edits post via `PostForm`
2. Form submission calls `blogpost.createPost()` or `updatepost()`
3. Appwrite database updated
4. Component refetches posts or updates state
5. UI re-renders with new data

---

## Key Libraries & Tools

### React Hooks Used
- **useState** - Local component state
- **useEffect** - Side effects and lifecycle
- **useDispatch** - Redux action dispatching
- **useRouteError** - Error handling in routes

### Redux Patterns
- **Redux Toolkit** for simplified reducer creation
- **createSlice** for combined action + reducer
- **configureStore** for store setup with middleware

### Appwrite Services
- **Client** - Connection to Appwrite server
- **Account** - User authentication
- **Databases** - Document CRUD operations
- **Storage** - File uploads and management
- **Query** - Query builder for filtering

### Routing
- `<BrowserRouter>` - Enables routing
- Route error boundaries for error handling
- Protected routes via `Protected` component

---

## Common Tasks

### Add a New Page
1. Create new component in `src/pages/YourPage.jsx`
2. Add route to `main.jsx` router config
3. Update navigation in `Header.jsx`

### Add a New Component
1. Create file in `src/components/`
2. Export from `src/components/index.js`
3. Import and use in pages

### Create a New Redux Slice
1. Create file in `src/store/yourSlice.js`
2. Use `createSlice()` from Redux Toolkit
3. Add to store reducers in `src/store/store.js`
4. Import and use with `useDispatch()` and `useSelector()`

### Add New Appwrite Collection
1. Go to Appwrite dashboard
2. Create collection with required attributes
3. Add collection ID to `.env`
4. Create service class in `src/appwrite/` with CRUD methods

### Modify Forms
1. Edit component in `src/components/post-form/Postform.jsx`
2. Update validation in `react-hook-form`
3. Adjust Appwrite schema if fields change

### Update Styling
- Use Tailwind CSS classes (e.g., `className="flex gap-4 p-2"`)
- Modify colors and utilities in `tailwind.config.js` if needed
- Global styles in `src/index.css`

---

## Troubleshooting

### Port 5173 Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Appwrite Connection Errors
- **Check endpoint**: Verify `VITE_APPWRITE_ENDPOINT` in `.env`
- **Check credentials**: Ensure all IDs match your Appwrite instance
- **CORS issues**: Configure CORS in Appwrite dashboard if using cloud

### TinyMCE Not Loading
- Verify `VITE_TINYMCE_API_KEY` is set and valid
- Check TinyMCE API key hasn't expired
- Clear browser cache and rebuild

### Build Errors
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run build
```

### Authentication Issues
- **Signup fails**: Email already exists or password too weak
- **Login fails**: Verify credentials in Appwrite console
- **Session lost**: Check Appwrite session settings

### Hot Module Replacement (HMR) Not Working
```bash
# Restart dev server
npm run dev
```

### ESLint Errors
```bash
# Run linter with auto-fix
npm run lint -- --fix

# Check specific file
npx eslint src/App.jsx
```

### Database Query Errors
- Verify collection ID and attribute names
- Check query syntax in `src/appwrite/config.js`
- Ensure user has database permissions in Appwrite

---

## Useful Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vite.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Appwrite Documentation](https://appwrite.io/docs)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Hook Form Docs](https://react-hook-form.com)

---

## Project Learning Goals

This project intentionally overcomplicates the architecture to learn:
- ✅ Modern React patterns (Hooks, Functional Components)
- ✅ State management with Redux Toolkit
- ✅ Backend-as-a-Service integration (Appwrite)
- ✅ Client-side routing with React Router
- ✅ Form handling and validation
- ✅ Rich text editing
- ✅ Authentication workflows
- ✅ Build tooling with Vite
- ✅ Code linting with ESLint

---

## Contributing Guidelines

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Run linter: `npm run lint`
4. Commit with clear messages: `git commit -m "feat: add new feature"`
5. Push and create a pull request

---

## License

This is a personal learning project. Modify and use as needed for educational purposes.

---

**Last Updated:** September 2026  
**Repository:** [akalp-mishra/Confab](https://github.com/akalp-mishra/Confab)
