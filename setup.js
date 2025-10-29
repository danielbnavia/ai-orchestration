#!/usr/bin/env node

/**
 * AI Orchestration Setup Script
 * Sets up the AI orchestration system with all required dependencies and configurations
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

// Check if dependencies are installed, provide helpful error if not
let chalk, ora, inquirer;
try {
  chalk = require('chalk');
  ora = require('ora');
  inquirer = require('inquirer');
  
  // Handle inquirer default export
  if (inquirer.default) {
    inquirer = inquirer.default;
  }
} catch (error) {
  console.error('❌ Dependencies not installed. Please run:');
  console.error('   npm install');
  console.error('');
  console.error('Error details:', error.message);
  console.error('');
  console.error('Then run this setup script again.');
  process.exit(1);
}

// Use the correct inquirer API
const inquirerPrompt = inquirer.prompt || inquirer.default?.prompt || inquirer;

class AIOrchestrationSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.configPath = path.join(this.projectRoot, '.env');
    this.logsDir = path.join(this.projectRoot, 'logs');
  }

  async run() {
    console.log(chalk.blue('🚀 AI Orchestration System Setup'));
    console.log(chalk.gray('This will set up the AI orchestration system for Workflow Hub\n'));

    try {
      // Check prerequisites
      await this.checkPrerequisites();
      
      // Create necessary directories
      await this.createDirectories();
      
      // Setup environment configuration
      await this.setupEnvironment();
      
      // Install dependencies
      await this.installDependencies();
      
      // Setup AI tools
      await this.setupAITools();
      
      // Test configuration
      await this.testConfiguration();
      
      console.log(chalk.green('\n✅ AI Orchestration System setup completed successfully!'));
      console.log(chalk.blue('\nNext steps:'));
      console.log(chalk.white('1. Start the system: npm run ai-orchestration:start'));
      console.log(chalk.white('2. Test with: npm run ai-orchestration:status'));
      console.log(chalk.white('3. Use interactive mode: npm run ai-orchestration:interactive'));
      
    } catch (error) {
      console.error(chalk.red('\n❌ Setup failed:'), error.message);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    const spinner = ora('Checking prerequisites...').start();
    
    try {
      // Check Node.js version
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      if (majorVersion < 16) {
        throw new Error(`Node.js 16+ required, found ${nodeVersion}`);
      }
      
      // Check if package.json exists
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      try {
        await fs.access(packageJsonPath);
      } catch {
        throw new Error('package.json not found. Please run this from the project root.');
      }
      
      spinner.succeed('Prerequisites check passed');
    } catch (error) {
      spinner.fail('Prerequisites check failed');
      throw error;
    }
  }

  async createDirectories() {
    const spinner = ora('Creating directories...').start();
    
    try {
      const directories = [
        'logs',
        'context',
        'workflows',
        'templates',
        'data'
      ];
      
      for (const dir of directories) {
        const dirPath = path.join(this.projectRoot, dir);
        try {
          await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
          if (error.code !== 'EEXIST') {
            throw error;
          }
        }
      }
      
      spinner.succeed('Directories created');
    } catch (error) {
      spinner.fail('Failed to create directories');
      throw error;
    }
  }

  async setupEnvironment() {
    const spinner = ora('Setting up environment configuration...').start();
    
    try {
      // Check if .env already exists
      let envExists = false;
      try {
        await fs.access(this.configPath);
        envExists = true;
      } catch {
        // .env doesn't exist, that's fine
      }
      
      if (envExists) {
        const { overwrite } = await inquirerPrompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: '.env file already exists. Overwrite?',
            default: false
          }
        ]);
        
        if (!overwrite) {
          spinner.info('Skipping environment setup');
          return;
        }
      }
      
      // Get API keys from user
      const answers = await inquirerPrompt([
        {
          type: 'input',
          name: 'anthropicApiKey',
          message: 'Anthropic API Key (for Claude):',
          default: process.env.ANTHROPIC_API_KEY || ''
        },
        {
          type: 'input',
          name: 'openaiApiKey',
          message: 'OpenAI API Key:',
          default: process.env.OPENAI_API_KEY || ''
        },
        {
          type: 'input',
          name: 'googleAiApiKey',
          message: 'Google AI API Key (for Gemini):',
          default: process.env.GOOGLE_AI_API_KEY || ''
        },
        {
          type: 'input',
          name: 'cursorApiKey',
          message: 'Cursor API Key:',
          default: process.env.CURSOR_API_KEY || ''
        },
        {
          type: 'input',
          name: 'perplexityApiKey',
          message: 'Perplexity API Key:',
          default: process.env.PERPLEXITY_API_KEY || ''
        },
        {
          type: 'input',
          name: 'cargowiseServiceUrl',
          message: 'CargoWise Service URL:',
          default: process.env.CARGOWISE_SERVICE_URL || 'http://localhost:8080'
        },
        {
          type: 'input',
          name: 'cargowiseApiKey',
          message: 'CargoWise API Key (optional):',
          default: process.env.CARGOWISE_API_KEY || ''
        }
      ]);
      
      // Create .env file
      const envContent = `# AI Orchestration System Configuration
# Generated on ${new Date().toISOString()}

# AI Service API Keys
ANTHROPIC_API_KEY=${answers.anthropicApiKey}
OPENAI_API_KEY=${answers.openaiApiKey}
GOOGLE_AI_API_KEY=${answers.googleAiApiKey}
CURSOR_API_KEY=${answers.cursorApiKey}
PERPLEXITY_API_KEY=${answers.perplexityApiKey}

# CargoWise Integration
CARGOWISE_SERVICE_URL=${answers.cargowiseServiceUrl}
CARGOWISE_API_KEY=${answers.cargowiseApiKey}

# Application Settings
NODE_ENV=development
LOG_LEVEL=info
APP_HOST=0.0.0.0
APP_PORT=3000

# Orchestration Settings
MAX_CONCURRENT_TASKS=3
TASK_TIMEOUT=300000
RETRY_ATTEMPTS=3
RETRY_DELAY=5000

# Monitoring
METRICS_INTERVAL=30000
ENABLE_MONITORING=true
`;
      
      await fs.writeFile(this.configPath, envContent);
      
      spinner.succeed('Environment configuration created');
    } catch (error) {
      spinner.fail('Failed to setup environment');
      throw error;
    }
  }

  async installDependencies() {
    const spinner = ora('Installing dependencies...').start();
    
    try {
      await this.runCommand('npm', ['install']);
      spinner.succeed('Dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      throw error;
    }
  }

  async setupAITools() {
    const spinner = ora('Setting up AI tools...').start();
    
    try {
      // Check which AI tools are available
      const availableTools = [];
      
      if (process.env.ANTHROPIC_API_KEY) {
        availableTools.push('Claude');
      }
      if (process.env.OPENAI_API_KEY) {
        availableTools.push('OpenAI');
      }
      if (process.env.GOOGLE_AI_API_KEY) {
        availableTools.push('Gemini');
      }
      if (process.env.CURSOR_API_KEY) {
        availableTools.push('Cursor');
      }
      if (process.env.PERPLEXITY_API_KEY) {
        availableTools.push('Perplexity');
      }
      
      if (availableTools.length === 0) {
        spinner.warn('No AI tools configured. Please add API keys to .env file');
      } else {
        spinner.succeed(`AI tools configured: ${availableTools.join(', ')}`);
      }
    } catch (error) {
      spinner.fail('Failed to setup AI tools');
      throw error;
    }
  }

  async testConfiguration() {
    const spinner = ora('Testing configuration...').start();
    
    try {
      // Test if we can load the orchestrator
      const { EnhancedAIOrchestrator } = require('./src/enhanced-orchestrator');
      
      // Create a test instance
      const orchestrator = new EnhancedAIOrchestrator();
      
      // Test initialization (without actually starting)
      spinner.succeed('Configuration test passed');
    } catch (error) {
      spinner.fail('Configuration test failed');
      console.error(chalk.red('Error:'), error.message);
      throw error;
    }
  }

  async runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });
      
      child.on('error', (error) => {
        reject(error);
      });
    });
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new AIOrchestrationSetup();
  setup.run().catch(error => {
    console.error(chalk.red('Setup failed:'), error.message);
    process.exit(1);
  });
}

module.exports = AIOrchestrationSetup;
