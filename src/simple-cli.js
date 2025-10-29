#!/usr/bin/env node

/**
 * Simple AI Orchestration CLI
 * Simplified version without inquirer to avoid dependency issues
 */

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const AIOrchestrator = require('./orchestrator');

const program = new Command();

program
  .name('ai-orchestration')
  .description('AI Orchestration System for Workflow Hub')
  .version('1.0.0');

// Initialize orchestrator
let orchestrator;

async function initializeOrchestrator() {
  if (!orchestrator) {
    orchestrator = new AIOrchestrator();
    await orchestrator.initialize();
  }
  return orchestrator;
}

// Delegate command
program
  .command('delegate <task>')
  .description('Delegate a task to the most appropriate AI tool')
  .option('-w, --workflow <workflow>', 'Specify workflow type')
  .option('-p, --priority <priority>', 'Set task priority', 'normal')
  .option('-c, --context <context>', 'Additional context (JSON string)')
  .action(async (task, options) => {
    const spinner = ora('Delegating task...').start();
    
    try {
      const orch = await initializeOrchestrator();
      
      const context = options.context ? JSON.parse(options.context) : null;
      
      const result = await orch.delegateTask(task, {
        workflow: options.workflow,
        priority: options.priority,
        context
      });
      
      spinner.succeed('Task completed successfully');
      
      console.log(chalk.green('\n📋 Task Result:'));
      console.log(chalk.blue(`Tool: ${result.tool}`));
      console.log(chalk.blue(`Method: ${result.metadata.method}`));
      console.log(chalk.white('\nResponse:'));
      console.log(result.response);
      
    } catch (error) {
      spinner.fail('Task failed');
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Show status of all AI tools')
  .action(async () => {
    const spinner = ora('Checking AI tools status...').start();
    
    try {
      const orch = await initializeOrchestrator();
      const status = orch.getStatus();
      
      spinner.succeed('Status retrieved');
      
      console.log(chalk.green('\n🤖 AI Tools Status:'));
      console.log(chalk.gray('═'.repeat(60)));
      
      Object.entries(status).forEach(([toolId, toolStatus]) => {
        const statusColor = toolStatus.status === 'ready' ? chalk.green : 
                           toolStatus.status === 'busy' ? chalk.yellow : 
                           toolStatus.status === 'error' ? chalk.red : chalk.gray;
        
        console.log(chalk.blue(`\n${toolStatus.name} (${toolId}):`));
        console.log(`  Status: ${statusColor(toolStatus.status)}`);
        console.log(`  Active Tasks: ${toolStatus.activeTasks}`);
        console.log(`  Last Activity: ${toolStatus.lastActivity || 'Never'}`);
        console.log(`  Capabilities: ${toolStatus.capabilities.join(', ')}`);
      });
      
    } catch (error) {
      spinner.fail('Failed to get status');
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Test command
program
  .command('test')
  .description('Test the AI orchestration system')
  .action(async () => {
    const spinner = ora('Testing AI orchestration system...').start();
    
    try {
      const orch = await initializeOrchestrator();
      
      // Test basic functionality
      const testTask = "Hello, this is a test message. Please respond with a brief greeting.";
      
      spinner.text = 'Testing task delegation...';
      const result = await orch.delegateTask(testTask, {
        workflow: 'test',
        priority: 'low'
      });
      
      spinner.succeed('Test completed successfully');
      
      console.log(chalk.green('\n✅ Test Results:'));
      console.log(chalk.blue(`Tool Used: ${result.tool}`));
      console.log(chalk.blue(`Response Time: ${result.metadata.timestamp}`));
      console.log(chalk.white('\nAI Response:'));
      console.log(result.response);
      
    } catch (error) {
      spinner.fail('Test failed');
      console.error(chalk.red('Error:'), error.message);
      console.log(chalk.yellow('\nTroubleshooting:'));
      console.log('1. Check your .env file has valid API keys');
      console.log('2. Ensure you have internet connectivity');
      console.log('3. Verify API key permissions and quotas');
      process.exit(1);
    }
  });

// Help command
program
  .command('help')
  .description('Show help information')
  .action(() => {
    console.log(chalk.blue('🚀 AI Orchestration System Help'));
    console.log(chalk.gray('═'.repeat(50)));
    console.log('');
    console.log(chalk.white('Available Commands:'));
    console.log('');
    console.log(chalk.green('  status') + chalk.gray('     - Show status of all AI tools'));
    console.log(chalk.green('  test') + chalk.gray('       - Test the system with a simple task'));
    console.log(chalk.green('  delegate') + chalk.gray('  - Delegate a task to AI tools'));
    console.log('');
    console.log(chalk.white('Examples:'));
    console.log('');
    console.log(chalk.blue('  npm run ai-orchestration:status'));
    console.log(chalk.blue('  npm run ai-orchestration:test'));
    console.log(chalk.blue('  npm run ai-orchestration:delegate "Review this code for security issues"'));
    console.log(chalk.blue('  npm run ai-orchestration:delegate "Generate API documentation" --workflow documentation'));
    console.log('');
    console.log(chalk.white('Configuration:'));
    console.log('  Edit .env file to add your API keys');
    console.log('  Supported services: Claude, OpenAI, Gemini, Cursor, Perplexity');
  });

// Parse command line arguments
program.parse();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n🛑 Shutting down...'));
  if (orchestrator) {
    await orchestrator.shutdown();
  }
  process.exit(0);
});
