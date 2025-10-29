#!/bin/bash

# Git Setup Script for AI Orchestration System
# This script automates the Git repository setup process

set -e  # Exit on error

echo "🚀 AI Orchestration System - Git Setup"
echo "========================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed"
    echo "Please install Git first: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Check if already a git repository
if [ -d .git ]; then
    echo "✅ Git repository already initialized"
else
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
fi
echo ""

# Check for .gitignore
if [ -f .gitignore ]; then
    echo "✅ .gitignore found"
else
    echo "⚠️  Warning: .gitignore not found"
fi
echo ""

# Check for .env.example
if [ -f .env.example ]; then
    echo "✅ .env.example found (template for other developers)"
else
    echo "⚠️  Warning: .env.example not found"
fi
echo ""

# Check if .env exists (should NOT be committed)
if [ -f .env ]; then
    echo "✅ .env exists (will be excluded from commits)"
    # Make sure .env is in .gitignore
    if grep -q '^\.env' .gitignore 2>/dev/null; then
        echo "✅ .env is in .gitignore"
    else
        echo "⚠️  Warning: .env not in .gitignore (should add it)"
    fi
else
    echo "ℹ️  .env not found (create from .env.example when needed)"
fi
echo ""

# Check if node_modules should be ignored
if [ -d node_modules ]; then
    if grep -q "node_modules" .gitignore 2>/dev/null; then
        echo "✅ node_modules will be excluded from commits"
    else
        echo "⚠️  Warning: node_modules not in .gitignore"
    fi
fi
echo ""

# Stage all files (respecting .gitignore)
echo "📦 Staging files..."
git add .
echo "✅ Files staged"
echo ""

# Show what will be committed
echo "📋 Files to be committed:"
git status --short
echo ""

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Commit
    echo "💾 Creating initial commit..."
    COMMIT_MSG="Initial commit: AI Orchestration System

Complete documentation:
- TROUBLESHOOTING.md - Complete debugging guide with all known issues
- AI_TEAM_INSTRUCTIONS.md - Specific instructions for AI assistants
- README_GITHUB.md - GitHub-ready README with status badges
- GIT_SETUP.md - Step-by-step Git setup instructions
- .gitignore - Protects sensitive files (.env, node_modules)
- .env.example - Template for other developers
- git-setup.sh - Automated Git setup script"
    git commit -m "$COMMIT_MSG"
    echo "✅ Initial commit created"
fi
echo ""

# Check for remote
if git remote -v | grep -q origin; then
    echo "✅ Remote 'origin' is already configured"
    git remote -v
    echo ""
    echo "🚀 Ready to push!"
    echo "Run: git push -u origin main"
else
    echo "⚠️  Remote 'origin' not configured"
    echo ""
    echo "📝 Next steps:"
    echo "1. Create a GitHub repository (if not already created)"
    echo "2. Add the remote:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/ai-orchestration.git"
    echo "3. Set branch to main:"
    echo "   git branch -M main"
    echo "4. Push to GitHub:"
    echo "   git push -u origin main"
fi
echo ""

echo "✅ Git setup complete!"
echo ""
echo "📚 Documentation created:"
echo "  - TROUBLESHOOTING.md"
echo "  - AI_TEAM_INSTRUCTIONS.md"
echo "  - README_GITHUB.md"
echo "  - GIT_SETUP.md"
echo "  - .gitignore"
echo "  - .env.example"
echo "  - git-setup.sh"
echo ""
echo "🔒 Protected files (not committed):"
echo "  - .env (API keys)"
echo "  - node_modules/ (dependencies)"
echo "  - logs/ (runtime logs)"
echo ""
