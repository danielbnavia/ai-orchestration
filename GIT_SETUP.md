# Git Repository Setup Commands

## Quick Setup

```bash
# Make script executable
chmod +x git-setup.sh

# Run setup
./git-setup.sh

# Create GitHub repo (via web or CLI)
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/ai-orchestration.git
git branch -M main
git push -u origin main
```

## Manual Setup

```bash
# Initialize Git
git init

# Add files
git add .

# Initial commit
git commit -m "Initial commit: AI Orchestration System (needs dependency fix)"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/ai-orchestration.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## What Gets Committed

✅ **Included**:
- All source code
- Documentation
- Package.json
- Setup scripts
- Examples
- Troubleshooting guides

❌ **Excluded** (via .gitignore):
- node_modules/
- .env (contains API keys!)
- logs/
- context/ and data/ directories
- IDE files

## Repository Description

```
AI Orchestration System - Coordinates multiple AI CLI tools (Claude, OpenAI, 
Gemini, Cursor, Perplexity) for collaborative development. Currently needs 
dependency fix. See TROUBLESHOOTING.md.
```

## Topics/Tags

```
ai, orchestration, claude, openai, gemini, cursor, perplexity, 
workflow, automation, nodejs, cli, multi-ai, cargowise
```

## After Pushing

Once pushed to GitHub, all your connected AI assistants can:
1. Clone the repository
2. Read the issue documentation
3. Debug and fix the dependency problem
4. Push fixes back
5. Collaborate on improvements

Each AI assistant should:
- Read AI_TEAM_INSTRUCTIONS.md first
- Check TROUBLESHOOTING.md for current status
- Update documentation with their changes
- Commit fixes with clear messages
