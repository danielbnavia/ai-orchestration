/**
 * Claude AI Manager
 * Manages Claude CLI interactions
 */

const BaseAIManager = require('./base-manager');
const axios = require('axios');

class ClaudeManager extends BaseAIManager {
  constructor(config) {
    super(config);
    this.apiBaseUrl = 'https://api.anthropic.com/v1';
  }

  /**
   * Process task using Claude
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
      this.logger.error('Claude task execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute task via Claude CLI
   */
  async executeViaCLI(prompt) {
    const { command, args } = this.config.cli;
    const cliArgs = [...args, '--prompt', prompt];
    
    const result = await this.executeCLI(command, cliArgs);
    
    return {
      tool: 'claude',
      response: result.stdout,
      metadata: {
        method: 'cli',
        timestamp: new Date()
      }
    };
  }

  /**
   * Execute task via Claude API
   */
  async executeViaAPI(prompt) {
    const response = await axios.post(
      `${this.apiBaseUrl}/messages`,
      {
        model: this.config.config.model,
        max_tokens: this.config.config.maxTokens,
        temperature: this.config.config.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': this.config.config.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        timeout: this.config.config.timeout
      }
    );

    return {
      tool: 'claude',
      response: response.data.content[0].text,
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
    let prompt = `You are Claude, an AI assistant helping with software development tasks.

Task: ${taskDescription}

Please provide a comprehensive response that addresses the task requirements.`;

    if (context) {
      prompt += `\n\nContext:\n${JSON.stringify(context, null, 2)}`;
    }

    // Add project-specific context if available
    prompt += `\n\nProject Context:
- This is part of the Workflow Hub project
- Focus on production-ready, secure, and maintainable solutions
- Follow best practices for Node.js/Express applications
- Consider integration with CargoWise, Office 365, and Google services`;

    return prompt;
  }

  /**
   * Get API key environment variable name
   */
  getAPIKeyEnvironmentVariable() {
    return 'ANTHROPIC_API_KEY';
  }
}

module.exports = ClaudeManager;
