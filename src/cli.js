#!/usr/bin/env node

/**
 * AI Orchestration CLI
 * Command-line interface for managing AI tools
 */

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
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

// Parallel command
program
  .command('parallel')
  .description('Execute multiple tasks in parallel')
  .option('-f, --file <file>', 'JSON file containing tasks')
  .action(async (options) => {
    const spinner = ora('Executing parallel tasks...').start();
    
    try {
      const orch = await initializeOrchestrator();
      
      let tasks;
      if (options.file) {
        const fs = require('fs').promises;
        const data = await fs.readFile(options.file, 'utf8');
        tasks = JSON.parse(data);
      } else {
        // Interactive task input
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'taskCount',
            message: 'How many tasks do you want to execute?',
            default: '2',
            validate: (input) => {
              const num = parseInt(input);
              return num > 0 && num <= 10 ? true : 'Please enter a number between 1 and 10';
            }
          }
        ]);
        
        const taskCount = parseInt(answers.taskCount);
        tasks = [];
        
        for (let i = 0; i < taskCount; i++) {
          const taskAnswers = await inquirer.prompt([
            {
              type: 'input',
              name: 'task',
              message: `Task ${i + 1} description:`
            },
            {
              type: 'list',
              name: 'workflow',
              message: 'Workflow type:',
              choices: ['codeReview', 'codeGeneration', 'research', 'architecture', 'testing']
            },
            {
              type: 'list',
              name: 'priority',
              message: 'Priority:',
              choices: ['low', 'normal', 'high']
            }
          ]);
          
          tasks.push(taskAnswers);
        }
      }
      
      const results = await orch.executeParallelTasks(tasks);
      
      spinner.succeed('All tasks completed');
      
      console.log(chalk.green('\n📊 Parallel Task Results:'));
      results.forEach((result, index) => {
        console.log(chalk.blue(`\nTask ${index + 1}: ${result.task.task}`));
        console.log(chalk.blue(`Tool: ${result.result.tool}`));
        console.log(chalk.white('Response:'));
        console.log(result.result.response);
        console.log(chalk.gray('─'.repeat(50)));
      });
      
    } catch (error) {
      spinner.fail('Parallel execution failed');
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

// Interactive mode
program
  .command('interactive')
  .alias('i')
  .description('Start interactive mode')
  .action(async () => {
    console.log(chalk.blue('🚀 Starting AI Orchestration Interactive Mode'));
    console.log(chalk.gray('Type "exit" to quit\n'));
    
    try {
      const orch = await initializeOrchestrator();
      
      while (true) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              { name: 'Delegate a task', value: 'delegate' },
              { name: 'Execute parallel tasks', value: 'parallel' },
              { name: 'Check status', value: 'status' },
              { name: 'Exit', value: 'exit' }
            ]
          }
        ]);
        
        if (answers.action === 'exit') {
          console.log(chalk.blue('👋 Goodbye!'));
          break;
        }
        
        if (answers.action === 'delegate') {
          const taskAnswers = await inquirer.prompt([
            {
              type: 'input',
              name: 'task',
              message: 'Describe the task:'
            },
            {
              type: 'list',
              name: 'workflow',
              message: 'Workflow type:',
              choices: ['codeReview', 'codeGeneration', 'research', 'architecture', 'testing']
            }
          ]);
          
          const spinner = ora('Executing task...').start();
          try {
            const result = await orch.delegateTask(taskAnswers.task, {
              workflow: taskAnswers.workflow
            });
            
            spinner.succeed('Task completed');
            console.log(chalk.green('\nResult:'));
            console.log(result.response);
          } catch (error) {
            spinner.fail('Task failed');
            console.error(chalk.red('Error:'), error.message);
          }
        }
        
        if (answers.action === 'status') {
          const status = orch.getStatus();
          console.log(chalk.green('\n🤖 AI Tools Status:'));
          Object.entries(status).forEach(([toolId, toolStatus]) => {
            const statusColor = toolStatus.status === 'ready' ? chalk.green : 
                               toolStatus.status === 'busy' ? chalk.yellow : chalk.red;
            console.log(`${toolStatus.name}: ${statusColor(toolStatus.status)}`);
          });
        }
      }
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
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
