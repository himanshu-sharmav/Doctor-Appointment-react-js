#!/bin/bash

echo "🚀 Resetting repository for college project..."

# Remove git history
rm -rf .git

# Initialize new git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Doctor Appointment Management System - College Project"

echo "✅ Repository reset complete!"
echo "📝 Next steps:"
echo "1. Update the README.md with your college details"
echo "2. Update package.json with your information"
echo "3. Add your GitHub remote: git remote add origin https://github.com/your-username/doctor-appointment-system.git"
echo "4. Push to your repository: git push -u origin main"
echo ""
echo "🎓 Good luck with your college project!"
