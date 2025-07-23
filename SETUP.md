# Frontend Setup Guide

This frontend application is designed to work with the CURL-based API endpoints. It includes JWT authentication and supports all the features mentioned in the CURL documentation.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://213.165.250.221:8000
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication Flow

The frontend now uses JWT authentication as specified in the CURL commands:

1. **Signup**: Users can create accounts at `/signup`
2. **Login**: Users authenticate at `/login` and receive a JWT token
3. **Token Storage**: JWT tokens are stored in localStorage as `access_token`
4. **Protected Routes**: All API calls include the Bearer token in headers
5. **Logout**: Tokens are removed from localStorage

## 📱 Features Implemented

### ✅ Authentication
- JWT-based authentication
- Signup/Login pages
- Protected routes
- Automatic token management

### ✅ Post by Keyword
- Keyword input with paste support
- Country and language selection
- Time interval configuration
- Minimum length settings
- Target database configuration
- Task status checking

### ✅ Post by News
- Country, language, and category selection
- News processing
- News article retrieval
- Target database configuration

### ✅ Content Processing
- Keyword-based content generation
- Country and language selection
- Minimum length configuration
- Target database support

### ✅ Task Management
- View all user tasks
- Real-time task status updates
- Task result display
- Individual task refresh

### ✅ Database Configuration
- Store database configurations
- Select active database
- List all configurations
- Delete configurations

## 🔧 API Integration

The frontend follows the exact CURL structure:

### Authentication Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Get current user

### Keywords Endpoints
- `POST /keywords/` - Process keywords
- `GET /keywords/task-status/{id}` - Get task status
- `GET /keywords/my-tasks` - Get user tasks

### News Endpoints
- `POST /news/` - Process news
- `GET /news/` - Get news articles
- `GET /news/my-news` - Get user news

### Content Endpoints
- `POST /content/keywords` - Process content keywords

### Admin Endpoints
- `POST /admin/store-db-config` - Store database config
- `POST /admin/select-db` - Select database
- `GET /admin/list-db-configs` - List configurations
- `DELETE /admin/delete-db-config/{name}` - Delete config
- `POST /admin/set-target-db` - Set target database
- `GET /admin/get-target-db` - Get target database

## 🎨 UI Components

The application uses:
- **shadcn/ui** components for consistent design
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Next.js 15** with App Router
- **TypeScript** for type safety

## 🔒 Security Features

- JWT token validation
- Protected route guards
- Automatic token refresh
- Secure token storage
- CSRF protection via Next.js

## 📊 Task Management

Tasks are managed asynchronously:
1. User submits a request
2. API returns a `task_id`
3. Frontend can check task status using the ID
4. Results are displayed when tasks complete

## 🗄️ Database Configuration

Users can:
- Store multiple database configurations
- Switch between databases
- Set target databases for content generation
- Manage database settings through the admin interface

## 🚨 Error Handling

- Network error handling
- Authentication error handling
- Form validation
- User-friendly error messages
- Loading states for better UX

## 🔄 State Management

- React hooks for local state
- Automatic user authentication checks
- Real-time task status updates
- Persistent authentication state

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interfaces
- Adaptive navigation

## 🎯 Usage Examples

### Creating a Keyword Post
1. Navigate to "Post by Keyword"
2. Add keywords (press Enter to add multiple)
3. Select country and language
4. Set time interval and minimum length
5. Optionally specify target database
6. Submit and monitor task status

### Processing News
1. Navigate to "Post by News"
2. Select country, language, and category
3. Optionally specify target database
4. Process news or get articles
5. View results and task status

### Managing Tasks
1. Click the clock icon in the header
2. View all your tasks
3. Refresh individual task status
4. Monitor task progress and results

## 🔧 Development

### Adding New Features
1. Update the API layer in `lib/api.ts`
2. Create new pages in `app/`
3. Add navigation links
4. Update types as needed

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Use shadcn/ui components when possible
- Maintain dark theme consistency

### Testing
- Test authentication flows
- Verify API integration
- Check responsive design
- Validate form submissions

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check if backend is running
   - Verify JWT secret is configured
   - Clear localStorage and re-login

2. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check backend server status
   - Review network tab for errors

3. **Task Status Issues**
   - Verify task IDs are valid
   - Check backend task processing
   - Refresh task status manually

4. **Database Configuration Issues**
   - Verify database credentials
   - Check database connection
   - Review admin endpoint responses

## 📈 Performance

- Optimized bundle size
- Lazy loading for components
- Efficient state management
- Minimal re-renders
- Fast page transitions

## 🔮 Future Enhancements

- Real-time notifications
- Advanced task scheduling
- Bulk operations
- Export functionality
- Advanced analytics
- Multi-language support 