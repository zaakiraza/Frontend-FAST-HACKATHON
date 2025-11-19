# Installation Instructions

## Required Dependencies

Install the authentication dependencies by running:

```bash
cd Backend
npm install bcrypt jsonwebtoken
```

### Dependencies Breakdown:

- **bcrypt** (v5.1.1): Password hashing library for secure password storage
- **jsonwebtoken** (v9.0.2): JWT token generation and verification for authentication

## Updated package.json

After installation, your `package.json` should include:

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mysql2": "^3.15.3",
    "nodemon": "^3.1.11"
  }
}
```

## Environment Setup

Make sure your `.env` file includes:

```env
# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production-use-long-random-string
```

**⚠️ IMPORTANT:** Change the JWT_SECRET to a secure random string in production!

## Database Setup

Execute the authentication schema in Railway MySQL:

```bash
mysql -h caboose.proxy.rlwy.net -P 41462 -u root -p railway < auth_schema.sql
```

Or use a MySQL client like MySQL Workbench, DBeaver, or phpMyAdmin to execute the `auth_schema.sql` file.

## Verify Installation

After installation, start the server:

```bash
npm run dev
```

Test the authentication endpoint:

```bash
curl http://localhost:3000/api/auth/login
```

You should see a response indicating missing credentials (which means the endpoint is working).

## Next Steps

1. Execute `auth_schema.sql` in Railway MySQL database
2. Test login with sample users (see AUTH_DOCUMENTATION.md)
3. Protect existing API endpoints with authentication middleware
4. Update Frontend to use JWT authentication
