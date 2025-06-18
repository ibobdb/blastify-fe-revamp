# This file contains some additional security configurations for the .gitignore file

# and information about what files should be excluded before pushing to GitHub.

# Logs directory

Remember to exclude the logs directory when pushing to GitHub.
The logs directory structure should be created automatically when needed
by the application.

# Environment variables

These are already excluded in .gitignore:

- .env
- .env.local
- .env.development.local
- .env.test.local
- .env.production.local

# Example .env file

Consider creating a .env.example file with placeholder values to help other
developers understand what environment variables are needed.

# Security Checklist before pushing to GitHub:

1. No hardcoded API keys or secrets
2. No real user credentials in test data
3. No private keys or certificates
4. No local logs committed
5. No IDE-specific settings except those that aid development
