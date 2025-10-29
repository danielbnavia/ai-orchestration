# AI Orchestration System - Installation Guide

## Quick Start

### Option 1: Automated Installation (Recommended)

```bash
# Navigate to the ai-orchestration directory
cd ai-orchestration

# Run the automated installer
node install.js

# Run the interactive setup
node setup.js
```

### Option 2: Manual Installation

```bash
# Navigate to the ai-orchestration directory
cd ai-orchestration

# Install dependencies
npm install

# Create basic .env file
cp .env.example .env

# Edit .env with your API keys
# Then run setup
node setup.js
```

## What the Installation Does

### 1. Dependency Installation (`install.js`)
- Installs all required npm packages
- Creates necessary directories (logs, context, workflows, etc.)
- Creates a basic `.env` file template

### 2. Interactive Setup (`setup.js`)
- Prompts for API keys for all AI services
- Configures environment variables
- Tests the configuration
- Sets up AI tools

## Required API Keys

You'll need API keys for the AI services you want to use:

- **Anthropic API Key** (for Claude) - [Get it here](https://console.anthropic.com/)
- **OpenAI API Key** (for GPT models) - [Get it here](https://platform.openai.com/api-keys)
- **Google AI API Key** (for Gemini) - [Get it here](https://makersuite.google.com/app/apikey)
- **Cursor API Key** (for Cursor IDE integration) - [Get it here](https://cursor.sh/)
- **Perplexity API Key** (for web search) - [Get it here](https://www.perplexity.ai/settings/api)

## Optional: CargoWise Integration

If you want to use the CargoWise integration features:

1. Ensure your CargoWise warehouse integration service is running
2. Set `CARGOWISE_SERVICE_URL` in your `.env` file
3. Add your CargoWise API key if required

## After Installation

Once installation is complete, you can:

```bash
# Check system status
npm run ai-orchestration:status

# Start the orchestration system
npm run ai-orchestration:start

# Use interactive mode
npm run ai-orchestration:interactive

# Run example workflows
node examples/cargowise-workflow-example.js
```

## Troubleshooting

### "Cannot find module" errors
- Make sure you ran `npm install` or `node install.js` first
- Check that you're in the correct directory (`ai-orchestration`)

### API key errors
- Verify your API keys are correct in the `.env` file
- Check that you have sufficient credits/quota for each service
- Some services may require account verification

### CargoWise integration errors
- Ensure the CargoWise service is running on the configured URL
- Check the service health endpoint: `curl http://localhost:8080/health`
- Verify network connectivity between services

## Next Steps

1. **Test the system**: Run `npm run ai-orchestration:status`
2. **Try examples**: Run the example workflows in the `examples/` directory
3. **Integrate with Workflow Hub**: Add orchestration endpoints to your backend
4. **Customize workflows**: Modify configurations in `config/ai-tools.json`

## Support

If you encounter issues:
1. Check the logs in the `logs/` directory
2. Verify your `.env` configuration
3. Test individual AI services separately
4. Review the comprehensive documentation in `README.md`
