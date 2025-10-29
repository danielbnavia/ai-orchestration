/**
 * Cursor Manager
 * Manages Cursor CLI and API interactions
 */

const BaseAIManager = require('./base-manager');
const axios = require('axios');

class CursorManager extends BaseAIManager {
  constructor(config) {
    super(config);
    this.apiBaseUrl = 'https://api.cursor.sh/v1';
  }

  /**
   * Process task using Cursor
   */
  async processTask(task) {
    const { task: taskDescription, context } = task;
    
    // Build the prompt with context
    const prompt = this.buildPrompt(taskDescription, context);
    
    try {
      // Try CLI first, fallback to API
      if (this.config.cli && this.config.cli.command) {
        return await this.executeViaCLI(prompt);
      } else {
        return await this.executeViaAPI(prompt);
      }
    } catch (error) {
      this.logger.error('Cursor task execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute task via Cursor CLI
   */
  async executeViaCLI(prompt) {
    const { command, args } = this.config.cli;
    const cliArgs = [...args, '--prompt', prompt];
    
    const result = await this.executeCLI(command, cliArgs);
    
    return {
      tool: 'cursor',
      response: result.stdout,
      metadata: {
        method: 'cli',
        timestamp: new Date()
      }
    };
  }

  /**
   * Execute task via Cursor API
   */
  async executeViaAPI(prompt) {
    const response = await axios.post(
      `${this.apiBaseUrl}/chat/completions`,
      {
        model: this.config.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are Cursor, an AI-powered code editor assistant. You excel at understanding code context, providing real-time assistance, and helping with IDE integration tasks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.config.maxTokens,
        temperature: this.config.config.temperature
      },
      {
        headers: {
          'Authorization': `Bearer ${this.config.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: this.config.config.timeout
      }
    );

    return {
      tool: 'cursor',
      response: response.data.choices[0].message.content,
      metadata: {
        method: 'api',
        model: response.data.model,
        usage: response.data.usage,
        timestamp: new Date()
      }
    };
  }

  /**
   * Build prompt with context
   */
  buildPrompt(taskDescription, context) {
    let prompt = `Task: ${taskDescription}

As Cursor, please provide assistance that focuses on:
1. IDE integration and real-time coding support
2. Code completion and refactoring suggestions
3. Context-aware development assistance
4. Debugging and error resolution
5. Code quality improvements`;

    if (context) {
      prompt += `\n\nContext:\n${JSON.stringify(context, null, 2)}`;
    }

    // Add project-specific context
    prompt += `\n\nProject Context:
- Workflow Hub: Full-stack web application
- Frontend: React, modern JavaScript/TypeScript
- Backend: Node.js, Express, REST APIs
- Database: PostgreSQL with migrations
- Development: VS Code/Cursor IDE, Git workflow
- Focus: Developer experience, code quality, maintainability`;

    return prompt;
  }

  /**
   * Get API key environment variable name
   */
  getAPIKeyEnvironmentVariable() {
    return 'CURSOR_API_KEY';
  }
}

module.exports = CursorManager;
