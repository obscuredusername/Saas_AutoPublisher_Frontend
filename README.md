# SocialPulse - Auto Publisher

A modern social media auto-publishing platform with database configuration management.

## Features

### Database Configuration Management
- **Store Database Configurations**: Add new database connections with name, URI, database name, and description
- **Select Database**: Choose which database to use for operations
- **List Configurations**: View all configured databases
- **Delete Configurations**: Remove database configurations

### User Interface
- **Responsive Dashboard**: Modern dark theme with sidebar navigation
- **Database Sidebar**: Shows all configured databases with selection capability
- **Configuration Page**: Dedicated page for managing database configurations
- **Mobile Support**: Fully responsive design with mobile sidebar

## API Endpoints

The frontend communicates with the backend API at `http://65.109.25.252:8000`:

- `POST /store-db-config` - Store a new database configuration
- `POST /select-db` - Select a database for use
- `GET /list-db-configs` - List all database configurations
- `DELETE /delete-db-config/{name}` - Delete a database configuration

## Getting Started

1. **Start the Backend Server**
   ```bash
   # Make sure your backend is running on http://65.109.25.252:8000
   ```

2. **Start the Frontend**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Access the Application**
   - Open http://localhost:3000
   - Navigate to the dashboard
   - Use the sidebar to manage database configurations

## Usage

### Adding a Database Configuration
1. Click the database icon in the header or the settings icon in the sidebar
2. Click "Add Configuration"
3. Fill in the form:
   - **Configuration Name**: A unique identifier (e.g., "staging_db")
   - **Database Name**: The actual database name (e.g., "staging_database")
   - **Database URI**: Connection string (e.g., "mongodb://staging-server:27017")
   - **Description**: Optional description of the configuration

### Selecting a Database
1. In the sidebar, click on any database configuration
2. The selected database will be highlighted and shown at the bottom of the sidebar
3. A success toast will confirm the selection

### Deleting a Configuration
1. Go to the database configuration page
2. Click the trash icon on any configuration card
3. Confirm the deletion in the dialog

## Example API Usage

```bash
# Store a database configuration
curl -X POST "http://65.109.25.252:8000/store-db-config" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "staging_db",
       "target_db_uri": "mongodb://staging-server:27017",
       "target_db": "staging_database",
       "description": "Staging environment database"
     }'

# Select a database
curl -X POST "http://65.109.25.252:8000/select-db" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "staging_db"
     }'

# List all configurations
curl -X GET "http://65.109.25.252:8000/list-db-configs"

# Delete a configuration
curl -X DELETE "http://65.109.25.252:8000/delete-db-config/staging_db"
```

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API Communication**: Fetch API

## Project Structure

```
├── app/
│   ├── dashboard/          # Dashboard page with sidebar
│   ├── database-config/    # Database configuration management
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/
│   ├── database-sidebar.tsx  # Database selection sidebar
│   └── ui/                # Reusable UI components
├── lib/
│   └── api.ts             # API service functions
└── types/                 # TypeScript type definitions
```

## Development

The application uses:
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Next.js App Router** for routing
- **React Server Components** where appropriate

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 