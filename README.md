# AI Orchestration System for Workflow Hub

## Overview

This system enables coordination of multiple AI CLI tools (Claude, OpenAI, Gemini, Cursor, and Perplexity) within a single project, managed by an AI project manager that can direct instructions to each tool for collaborative development. The system integrates with the existing CargoWise warehouse integration AI service to provide comprehensive logistics and workflow automation.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Enhanced AI Project Manager                              │
│              (Central Orchestration Hub with CargoWise Integration)        │
└─────────────────┬───────────────────────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐                    ┌─────────────────────────┐
    │             │             │                    │   CargoWise Integration │
    │             │             │                    │   Service (Python)      │
    │             │             │                    │   - AI Schema Mapping   │
    │             │             │                    │   - Data Transformation │
    │             │             │                    │   - Validation Engine   │
    │             │             │                    │   - Event Monitoring    │
    │             │             │                    └─────────┬───────────────┘
┌───▼───┐    ┌───▼───┐    ┌───▼───┐    ┌───▼───┐    ┌───▼───┐ │
│Claude │    │OpenAI │    │Gemini │    │Cursor │    │Perplex│ │
│  CLI  │    │  CLI  │    │  CLI  │    │  CLI  │    │  CLI  │ │
└───────┘    └───────┘    └───────┘    └───────┘    └───────┘ │
                                                              │
                                                              │
┌─────────────────────────────────────────────────────────────▼─────────────┐
│                    Workflow Hub Backend                                    │
│              - Task Management System                                      │
│              - Email Integration (Office 365)                             │
│              - Document Management (Google Drive)                         │
│              - User Management & Authentication                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Features

### Core AI Orchestration
- **Multi-AI Coordination**: Seamlessly coordinate between Claude, OpenAI, Gemini, Cursor, and Perplexity
- **Task Delegation**: Intelligent routing of tasks to the most appropriate AI tool
- **Session Management**: Maintain persistent sessions across all AI tools
- **Shared Context**: Unified context sharing between all AI assistants
- **Real-time Monitoring**: Track status and performance of all AI tools
- **Workflow Automation**: Automated task sequencing and dependency management

### CargoWise Integration
- **AI Schema Mapping**: LLM-assisted field-to-field mapping with confidence scoring
- **Auto-Generated Transforms**: JSONata templates generated and optimized by AI
- **Intelligent Validation**: AI-powered test data synthesis and quality assessment
- **Automated Triage**: Smart error analysis with remediation suggestions
- **Event-Driven Architecture**: Reliable processing with outbox pattern
- **Human-in-the-Loop**: Approval workflows for critical operations

### Workflow Hub Integration
- **Task Management**: Integration with Workflow Hub's task management system
- **Email Processing**: AI-assisted email analysis and task creation
- **Document Management**: Intelligent document processing and categorization
- **User Assistance**: Context-aware help and guidance for users

## Supported AI Tools

### 1. Claude CLI
- **Use Cases**: Code review, complex reasoning, documentation
- **Strengths**: Excellent at understanding context, code analysis
- **Integration**: Via Anthropic API or Claude Desktop

### 2. OpenAI CLI
- **Use Cases**: Code generation, text processing, API development
- **Strengths**: Fast code generation, API integration
- **Integration**: Via OpenAI API

### 3. Gemini CLI
- **Use Cases**: Multi-modal tasks, large context windows, research
- **Strengths**: 1M+ token context, multimodal capabilities
- **Integration**: Via Google AI Studio API

### 4. Cursor CLI
- **Use Cases**: IDE integration, real-time coding assistance
- **Strengths**: Context-aware code completion, refactoring
- **Integration**: Via Cursor's API or desktop application

### 5. Perplexity CLI
- **Use Cases**: Web search, real-time information, research
- **Strengths**: Up-to-date information, web search capabilities
- **Integration**: Via Perplexity API

## Installation

### Prerequisites
- Node.js 16+ 
- Access to AI service APIs (Anthropic, OpenAI, Google AI, Cursor, Perplexity)
- CargoWise warehouse integration service running (optional but recommended)

### Quick Setup

```bash
# Clone and navigate to the AI orchestration directory
cd ai-orchestration

# Run the interactive setup script
node setup.js

# Install dependencies
npm install

# Start the system
npm run ai-orchestration:start
```

### Manual Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Set up CargoWise Integration** (Optional)
   ```bash
   # Ensure CargoWise service is running on localhost:8080
   # Or update CARGOWISE_SERVICE_URL in .env
   ```

4. **Initialize the System**
   ```bash
   npm run ai-orchestration:start
   ```

## Usage

### Basic Commands

```bash
# Start the AI orchestration system
npm run ai-orchestration:start

# Delegate a task to the most appropriate AI
npm run ai-orchestration:delegate "Review the authentication middleware"

# Run parallel tasks across multiple AIs
npm run ai-orchestration:parallel "Generate API docs" "Review security" "Search for best practices"

# Check system status
npm run ai-orchestration:status

# Interactive mode
npm run ai-orchestration:interactive
```

### CargoWise Integration Examples

```bash
# Schema mapping task
npm run ai-orchestration:delegate "Create schema mapping between Shopify and CargoWise" --workflow cargowise

# Data transformation task
npm run ai-orchestration:delegate "Generate JSONata transformation for order data" --workflow cargowise

# Research task
npm run ai-orchestration:delegate "Research CargoWise eAdaptor best practices" --workflow research
```

### Programmatic Usage

```javascript
const { EnhancedAIOrchestrator } = require('./src/enhanced-orchestrator');

async function example() {
  const orchestrator = new EnhancedAIOrchestrator();
  await orchestrator.initialize();
  
  // Delegate a task
  const result = await orchestrator.delegateTask(
    "Create schema mapping for Shopify to CargoWise integration",
    { workflow: 'cargowise', priority: 'high' }
  );
  
  console.log(result.response);
  
  await orchestrator.shutdown();
}
```

## Configuration

### Environment Variables

```bash
# AI Service API Keys
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GOOGLE_AI_API_KEY=your_google_ai_key
CURSOR_API_KEY=your_cursor_key
PERPLEXITY_API_KEY=your_perplexity_key

# CargoWise Integration
CARGOWISE_SERVICE_URL=http://localhost:8080
CARGOWISE_API_KEY=your_cargowise_key

# Application Settings
NODE_ENV=development
LOG_LEVEL=info
MAX_CONCURRENT_TASKS=3
TASK_TIMEOUT=300000
```

### AI Tool Configuration

Each AI tool can be configured with specific parameters, timeouts, and capabilities in the `config/ai-tools.json` file. The system supports:

- **Priority-based routing**: Tasks are routed to the most appropriate AI tool
- **Workflow-specific configurations**: Different settings for different types of work
- **Fallback mechanisms**: Graceful degradation when AI services are unavailable
- **Custom capabilities**: Define what each AI tool is best suited for

## Examples

See the `examples/` directory for comprehensive examples:

- `cargowise-workflow-example.js` - Complete CargoWise integration workflow
- `parallel-tasks-example.js` - Parallel task execution across multiple AIs
- `error-handling-example.js` - Error handling and recovery patterns
