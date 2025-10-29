# AI Team Instructions

## 🎯 Mission
Fix the broken dependency issue and get the AI Orchestration System fully operational.

## 🔴 Critical Issue
**rxjs module is broken** - Cannot load inquirer, blocking all setup and interactive commands.

## 👥 AI Team Members
This project needs debugging from multiple AI assistants connected to GitHub:
- Claude (code analysis, debugging)
- GitHub Copilot (VSCode integration, fixes)
- Cursor (IDE-based debugging)
- Any other AI assistants with GitHub access

## 📋 Immediate Action Required

### Step 1: Fix Dependencies (URGENT)
```bash
sudo rm -rf node_modules
rm -f package-lock.json
npm install
node test-deps.js
```

**Expected Result**: All dependencies load successfully

### Step 2: Run Setup
```bash
node setup.js
```

**Expected Result**: Setup completes (may skip if .env exists)

### Step 3: Test System
```bash
npm run ai-orchestration:status
```

**Expected Result**: Shows status of 5 AI tools

## 🔍 Debugging Checklist

- [ ] Check Node.js version (must be >= 16)
- [ ] Verify package.json is intact
- [ ] Check .env file has API keys
- [ ] Ensure no permission issues
- [ ] Verify npm cache is clean
- [ ] Check for conflicting global packages
- [ ] Test each dependency individually
- [ ] Review error logs in detail

## 📝 Files to Review

1. **package.json** - Dependency versions
2. **.env** - API keys (already configured ✅)
3. **setup.js** - Setup script
4. **src/cli.js** - CLI commands
5. **src/orchestrator.js** - Main orchestrator
6. **test-deps.js** - Dependency test script

## 🐛 Current Error
```
Error: Cannot find module '../scheduler/timeoutProvider'
Location: node_modules/rxjs/dist/cjs/internal/util/reportUnhandledError.js
Impact: inquirer cannot load
```

## 💡 Possible Solutions

### Solution A: Version Lock
Lock rxjs and inquirer to known working versions:
- inquirer: 8.2.6
- rxjs: 7.8.1

### Solution B: Alternative Prompt Library
Replace inquirer with:
- prompts
- enquirer
- readline-sync (built-in alternative)

### Solution C: Bypass Interactive Setup
Create non-interactive setup that:
- Reads from .env directly (already exists)
- Skips prompts
- Just validates configuration

## 🎨 Each AI Should

### Claude (Anthropic)
- Analyze the dependency tree
- Find root cause of rxjs issue
- Suggest architectural fixes
- Review error handling

### GitHub Copilot
- Generate fixes in VSCode
- Suggest code improvements
- Auto-complete corrected code
- Create unit tests

### Cursor
- Debug in IDE context
- Fix code in real-time
- Suggest refactors
- Implement fixes directly

### Other AIs
- Cross-reference solutions
- Validate fixes
- Test edge cases
- Document findings

## 📊 Progress Tracking

Update this section as work progresses:

```
[Current DateTime: 2025-10-29T11:10:55.028Z]

Status: 🔴 BLOCKED - Dependencies broken
Priority: HIGH
Assigned: All available AI assistants

Progress:
- [x] Identified issue (rxjs missing module)
- [x] API keys configured
- [x] npm scripts updated
- [ ] Dependencies fixed
- [ ] Setup completed
- [ ] System tested
- [ ] Documentation updated
```

## 🚦 Status Indicators

Use these when updating:
- 🔴 BLOCKED - Cannot proceed
- 🟡 IN PROGRESS - Working on it
- 🟢 COMPLETED - Done and verified
- ⚪ PENDING - Not started

## 📞 Communication Protocol

When an AI fixes something:
1. Update this file
2. Document what was changed
3. Note any remaining issues
4. Hand off to next AI if needed

## ✅ Definition of Done

The issue is resolved when:
1. `node test-deps.js` passes
2. `node setup.js` completes
3. `npm run ai-orchestration:status` works
4. Can delegate a test task successfully
5. All 5 AI tools respond

## 🔄 Handoff Notes

**From**: Initial setup assistant
**To**: Debugging team (all AIs with GitHub access)
**Status**: Dependencies broken, needs clean install
**Next**: Fix rxjs/inquirer issue first, then proceed with setup
