# AI Orchestration System - Setup & Troubleshooting Guide

## 🚨 Current Issue
The project has a **broken dependency** (`rxjs` module) that prevents the setup from completing.

## 📋 Problem Details
- **Error**: `Cannot find module '../scheduler/timeoutProvider'` in rxjs
- **Affected**: inquirer package (used for interactive setup)
- **Cause**: Corrupted node_modules installation
- **Impact**: Cannot run `node setup.js` or any interactive commands

## 🔧 Required Fixes

### Fix 1: Clean Dependencies Installation
```bash
# Remove corrupted modules
sudo rm -rf node_modules
rm -f package-lock.json

# Fresh install
npm install

# Verify fix
node test-deps.js
```

### Fix 2: Alternative - Use npm cache clean
```bash
npm cache clean --force
sudo rm -rf node_modules
rm -f package-lock.json
npm install
```

### Fix 3: If still failing, lock specific versions
Update `package.json` to use exact versions:
```json
"inquirer": "8.2.6",
"rxjs": "7.8.1"
```

Then reinstall:
```bash
sudo rm -rf node_modules package-lock.json
npm install
```

## 📝 Setup Status

### ✅ Completed
- [x] Project structure created
- [x] package.json configured
- [x] API keys added to .env file
  - Anthropic API (Claude)
  - OpenAI API
  - Google AI API (Gemini)
  - Cursor API
  - Perplexity API
- [x] npm scripts updated

### ❌ Blocked (Dependencies Issue)
- [ ] Dependencies fully installed and working
- [ ] Setup script completed
- [ ] System tested and verified
- [ ] CLI commands tested

## 🎯 Tasks for AI Assistants

### Task 1: Fix Dependency Issue (HIGH PRIORITY)
**Objective**: Resolve the broken rxjs/inquirer dependency

**Steps**:
1. Investigate why rxjs module is missing files
2. Check if it's a version conflict
3. Clean install all dependencies
4. Verify with `node test-deps.js`

**Expected Outcome**: All dependencies load without errors

### Task 2: Verify Setup Script
**Objective**: Ensure setup.js runs successfully

**Steps**:
1. Run `node setup.js` after fixing dependencies
2. Handle any prompts (skip if .env already exists)
3. Verify directories are created (logs, context, workflows, templates, data)
4. Check configuration is loaded correctly

**Expected Outcome**: Setup completes with success message

### Task 3: Test CLI Commands
**Objective**: Verify all CLI commands work

**Commands to test**:
```bash
npm run ai-orchestration:status
npm run ai-orchestration:delegate "Test task"
npm run ai-orchestration:interactive
```

**Expected Outcome**: Each command runs without errors

### Task 4: Verify AI Tool Integration
**Objective**: Confirm each AI tool can be reached

**Steps**:
1. Test Claude API connection
2. Test OpenAI API connection
3. Test Gemini API connection
4. Test Cursor API connection
5. Test Perplexity API connection

**Expected Outcome**: All 5 AI tools show as "ready"

### Task 5: Create Working Example
**Objective**: Demonstrate the system working end-to-end

**Steps**:
1. Start orchestrator
2. Delegate a simple task (e.g., "Explain what this system does")
3. Show which AI tool was selected
4. Display the response
5. Document the workflow

**Expected Outcome**: Complete example of task delegation

## 🛠️ System Architecture

```
AI Orchestration System
├── Multiple AI Tools (Claude, OpenAI, Gemini, Cursor, Perplexity)
├── Central Orchestrator (routes tasks to best AI)
├── CLI Interface (user commands)
├── Workflow Engine (manages multi-step tasks)
└── CargoWise Integration (logistics workflows)
```

## 📦 Environment Configuration

Location: `.env` file (already configured)

```env
ANTHROPIC_API_KEY=sk-ant-api03-*** (✅ SET)
OPENAI_API_KEY=sk-proj-*** (✅ SET)
GOOGLE_AI_API_KEY=AQ.*** (✅ SET)
CURSOR_API_KEY=key_*** (✅ SET)
PERPLEXITY_API_KEY=pplx-*** (✅ SET)
CARGOWISE_SERVICE_URL=http://localhost:8080
NODE_ENV=development
LOG_LEVEL=info
MAX_CONCURRENT_TASKS=3
TASK_TIMEOUT=300000
```

## 🐛 Known Issues

1. **rxjs dependency broken** (CRITICAL)
   - Missing scheduler/timeoutProvider module
   - Blocks all interactive commands
   - Fix: Clean reinstall (see Fix 1 above)

2. **Permission issues on Linux/WSL**
   - Some files locked in node_modules
   - Fix: Use `sudo rm -rf node_modules`

## 💡 Additional Context

- **Node Version Required**: >= 16.0.0
- **Package Manager**: npm
- **Environment**: Works on Windows/Linux/WSL
- **Dependencies**: 439 packages total

## 🔗 Repository Information

**Purpose**: AI orchestration system for Workflow Hub
**Main Features**: 
- Multi-AI coordination
- Task delegation
- Parallel execution
- Workflow automation
- CargoWise integration

## 📞 AI Assistant Instructions

When debugging this project:
1. **Always check dependencies first** - Run `node test-deps.js`
2. **Read error messages carefully** - Look for missing modules
3. **Check .env file** - Ensure API keys are present
4. **Test incrementally** - One command at a time
5. **Document findings** - Update this file with solutions

## ✅ Success Criteria

The system is working when:
- [ ] `node test-deps.js` shows all dependencies loaded
- [ ] `node setup.js` completes without errors
- [ ] `npm run ai-orchestration:status` shows AI tools status
- [ ] Can delegate a task and get a response
- [ ] All 5 AI tools are accessible

## 🚀 Next Steps After Fix

1. Test basic delegation
2. Test parallel execution
3. Test CargoWise workflows
4. Create example workflows
5. Document usage patterns
6. Add error handling improvements
