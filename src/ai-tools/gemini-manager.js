/**
 * Gemini Manager
 * Manages Google Gemini CLI and API interactions
 */

const BaseAIManager = require('./base-manager');
const axios = require('axios');

class GeminiManager extends BaseAIManager {
  constructor(config) {
    super(config);
    this.apiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  /**
   * Process task using Gemini
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
      this.logger.error('Gemini task execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute task via Gemini CLI
   */
  async executeViaCLI(prompt) {
    const { command, args } = this.config.cli;
    const cliArgs = [...args, '--prompt', prompt];
    
    const result = await this.executeCLI(command, cliArgs);
    
    return {
      tool: 'gemini',
      response: result.stdout,
      metadata: {
        method: 'cli',
        timestamp: new Date()
      }
    };
  }

  /**
   * Execute task via Gemini API
   */
  async executeViaAPI(prompt) {
    const modelName = `models/${this.config.config.model}`;
    
    const response = await axios.post(
      `${this.apiBaseUrl}/${modelName}:generateContent?key=${this.config.config.apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: this.config.config.maxTokens,
          temperature: this.config.config.temperature,
          topP: 0.8,
          topK: 10
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: this.config.config.timeout
      }
    );

    return {
      tool: 'gemini',
      response: response.data.candidates[0].content.parts[0].text,
      metadata: {
        method: 'api',
        model: this.config.config.model,
        usage: response.data.usageMetadata,
        timestamp: new Date()
      }
    };
  }

  /**
   * Build prompt with context
   */
  buildPrompt(taskDescription, context) {
    let prompt = `You are Gemini, Google's advanced AI model with multimodal capabilities and large context windows.

Task: ${taskDescription}

Please provide a comprehensive response that leverages your strengths in:
- Large context understanding
- Multimodal analysis
- Research and data analysis
- Creative problem solving`;

    if (context) {
      prompt += `\n\nContext:\n${JSON.stringify(context, null, 2)}`;
    }

    // Add project-specific context
    prompt += `\n\nProject Context:
- Workflow Hub: Enterprise logistics and workflow management
- Architecture: Microservices, API-first design
- Data: Large datasets, real-time processing
- Integration: Multiple external systems and APIs
- Focus: Performance, scalability, data insights`;

    return prompt;
  }

  /**
   * Get API key environment variable name
   */
  getAPIKeyEnvironmentVariable() {
    return 'GOOGLE_AI_API_KEY';
  }
}

module.exports = GeminiManager;
