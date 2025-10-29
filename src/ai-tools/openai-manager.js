/**
 * OpenAI Manager
 * Manages OpenAI CLI and API interactions
 */

const BaseAIManager = require('./base-manager');
const axios = require('axios');

class OpenAIManager extends BaseAIManager {
  constructor(config) {
    super(config);
    this.apiBaseUrl = 'https://api.openai.com/v1';
  }

  /**
   * Process task using OpenAI
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
      this.logger.error('OpenAI task execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute task via OpenAI CLI
   */
  async executeViaCLI(prompt) {
    const { command, args } = this.config.cli;
    const cliArgs = [...args, '--prompt', prompt];
    
    const result = await this.executeCLI(command, cliArgs);
    
    return {
      tool: 'openai',
      response: result.stdout,
      metadata: {
        method: 'cli',
        timestamp: new Date()
      }
    };
  }

  /**
   * Execute task via OpenAI API
   */
  async executeViaAPI(prompt) {
    const response = await axios.post(
      `${this.apiBaseUrl}/chat/completions`,
      {
        model: this.config.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert software developer and AI assistant specializing in code generation, API development, and technical problem solving.'
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
      tool: 'openai',
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

Please provide a detailed solution that includes:
1. Clear explanation of the approach
2. Code examples where applicable
3. Best practices and considerations
4. Testing recommendations`;

    if (context) {
      prompt += `\n\nContext:\n${JSON.stringify(context, null, 2)}`;
    }

    // Add project-specific context
    prompt += `\n\nProject Context:
- Workflow Hub: A logistics and workflow management platform
- Tech Stack: Node.js, Express, PostgreSQL, React
- Integrations: CargoWise, Office 365, Google Drive
- Focus on: Scalability, security, maintainability`;

    return prompt;
  }

  /**
   * Get API key environment variable name
   */
  getAPIKeyEnvironmentVariable() {
    return 'OPENAI_API_KEY';
  }
}

module.exports = OpenAIManager;
