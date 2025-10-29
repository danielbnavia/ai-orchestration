/**
 * Perplexity Manager
 * Manages Perplexity CLI and API interactions
 */

const BaseAIManager = require('./base-manager');
const axios = require('axios');

class PerplexityManager extends BaseAIManager {
  constructor(config) {
    super(config);
    this.apiBaseUrl = 'https://api.perplexity.ai/chat/completions';
  }

  /**
   * Process task using Perplexity
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
      this.logger.error('Perplexity task execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute task via Perplexity CLI
   */
  async executeViaCLI(prompt) {
    const { command, args } = this.config.cli;
    const cliArgs = [...args, '--query', prompt];
    
    const result = await this.executeCLI(command, cliArgs);
    
    return {
      tool: 'perplexity',
      response: result.stdout,
      metadata: {
        method: 'cli',
        timestamp: new Date()
      }
    };
  }

  /**
   * Execute task via Perplexity API
   */
  async executeViaAPI(prompt) {
    const response = await axios.post(
      this.apiBaseUrl,
      {
        model: this.config.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are Perplexity AI, an expert at web search and real-time information gathering. You excel at finding current, accurate information and providing comprehensive research.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.config.maxTokens,
        temperature: this.config.config.temperature,
        stream: false
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
      tool: 'perplexity',
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

As Perplexity AI, please provide assistance that focuses on:
1. Web search and real-time information gathering
2. Current trends and latest developments
3. Research and fact-checking
4. Industry best practices and standards
5. Up-to-date documentation and resources`;

    if (context) {
      prompt += `\n\nContext:\n${JSON.stringify(context, null, 2)}`;
    }

    // Add project-specific context
    prompt += `\n\nProject Context:
- Workflow Hub: Enterprise logistics and workflow management platform
- Industry: Supply chain, logistics, freight forwarding
- Technologies: Modern web development, cloud services, APIs
- Focus: Current best practices, security standards, integration patterns
- Research Areas: CargoWise integration, Office 365 APIs, Google services`;

    return prompt;
  }

  /**
   * Get API key environment variable name
   */
  getAPIKeyEnvironmentVariable() {
    return 'PERPLEXITY_API_KEY';
  }
}

module.exports = PerplexityManager;
