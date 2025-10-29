# AI Orchestration System

[![Status](https://img.shields.io/badge/status-setup-yellow)](https://github.com)
[![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-broken-red)](./TROUBLESHOOTING.md)

## 🚨 CURRENT STATUS: NEEDS FIX

**Issue**: Broken rxjs dependency preventing setup completion  
**Priority**: HIGH  
**See**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) and [AI_TEAM_INSTRUCTIONS.md](./AI_TEAM_INSTRUCTIONS.md)

## 📖 Overview

AI orchestration system that coordinates multiple AI CLI tools (Claude, OpenAI, Gemini, Cursor, and Perplexity) for collaborative development tasks within Workflow Hub.

## 🏗️ Project Structure

```
ai-orchestration/
├── .env                          # ✅ API keys configured
├── package.json                  # ✅ Dependencies defined
├── setup.js                      # ❌ Blocked by broken deps
├── src/
│   ├── cli.js                   # CLI interface
│   ├── orchestrator.js          # Main orchestrator
│   ├── enhanced-orchestrator.js # Advanced features
│   └── ai-tools/                # AI tool integrations
├── config/                      # Configuration files
├── workflows/                   # Workflow definitions
├── templates/                   # Task templates
├── logs/                        # System logs
└── examples/                    # Usage examples
```

## 🔴 Known Issues

### Critical: Broken Dependencies
- **Error**: `Cannot find module '../scheduler/timeoutProvider'` in rxjs
- **Impact**: Cannot run setup or interactive commands
- **Solution**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

```bash
# Quick fix attempt
sudo rm -rf node_modules package-lock.json
npm install
node test-deps.js
```

## ✅ What's Working

- [x] Project structure created
- [x] API keys configured in .env
- [x] npm scripts defined
- [x] Documentation created
- [x] Source code written

## ❌ What's Blocked

- [ ] Dependencies fully functional
- [ ] Setup script completion
- [ ] CLI commands operational
- [ ] AI tools tested
- [ ] End-to-end workflow verified

## 🎯 For AI Assistants

**This repository needs help from multiple AI systems to debug and fix!**

If you're an AI assistant with access to this GitHub repository:

1. **Read**: [AI_TEAM_INSTRUCTIONS.md](./AI_TEAM_INSTRUCTIONS.md)
2. **Check**: Current issue status in [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. **Fix**: Address the dependency issue first
4. **Test**: Verify with `node test-deps.js`
5. **Update**: Document your changes
6. **Hand off**: Update status for next AI

## 🔧 Quick Start (When Fixed)

```bash
# Install dependencies
npm install

# Run setup
node setup.js

# Check status
npm run ai-orchestration:status

# Test delegation
npm run ai-orchestration:delegate "Explain this system"

# Interactive mode
npm run ai-orchestration:interactive
```

## 📋 Available Commands

```bash
npm run ai-orchestration:status        # Show AI tools status
npm run ai-orchestration:delegate      # Delegate a task
npm run ai-orchestration:parallel      # Execute parallel tasks
npm run ai-orchestration:interactive   # Interactive mode
npm run ai-orchestration:start         # Start orchestrator
npm run ai-orchestration:help          # Show help
```

## 🔑 Environment Variables

Already configured in `.env`:

```env
ANTHROPIC_API_KEY     # ✅ Claude
OPENAI_API_KEY        # ✅ OpenAI
GOOGLE_AI_API_KEY     # ✅ Gemini
CURSOR_API_KEY        # ✅ Cursor
PERPLEXITY_API_KEY    # ✅ Perplexity
CARGOWISE_SERVICE_URL # ⚪ Optional
```

## 🤖 Supported AI Tools

1. **Claude** - Code review, analysis, reasoning
2. **OpenAI** - Code generation, APIs
3. **Gemini** - Large context, multimodal
4. **Cursor** - IDE integration, real-time coding
5. **Perplexity** - Web search, research

## 📚 Documentation

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Detailed debugging guide
- [AI_TEAM_INSTRUCTIONS.md](./AI_TEAM_INSTRUCTIONS.md) - Instructions for AI assistants
- [README.md](./README.md) - Full project documentation
- [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) - Integration details

## 🐛 Reporting Issues

**Current Issue Tracker**:
- Status: 🔴 BLOCKED
- Issue: Broken rxjs dependency
- Date: 2025-10-29
- Priority: HIGH
- Assigned: All available AI assistants

## 🚀 Roadmap

- [ ] Fix dependency issue (URGENT)
- [ ] Complete setup process
- [ ] Test all AI integrations
- [ ] Verify workflows
- [ ] Add more examples
- [ ] Improve error handling
- [ ] Add monitoring
- [ ] Create CI/CD pipeline

## 📞 AI Collaboration

This project is designed to be debugged and improved by multiple AI systems working together:

- **Claude**: Deep analysis and architectural fixes
- **Copilot**: Code suggestions and completions
- **Cursor**: Real-time IDE debugging
- **Other AIs**: Cross-validation and testing

## 🏁 Success Criteria

System is ready when:
1. All dependencies load successfully
2. Setup completes without errors
3. All 5 AI tools show as "ready"
4. Can delegate and complete a test task
5. All CLI commands work

## 📝 License

MIT

## 👥 Team

Workflow Hub Team + AI Assistant Collaboration

---

**Last Updated**: 2025-10-29T11:10:55.028Z  
**Status**: 🔴 Needs Fix - See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
