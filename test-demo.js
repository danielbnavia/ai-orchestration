#!/usr/bin/env node

/**
 * Demo script to test AI orchestration without requiring API keys
 */

const chalk = require('chalk');
const AIOrchestrator = require('./src/orchestrator');

async function runDemo() {
  let orchestrator;
  
  console.log(chalk.blue('🚀 AI Orchestration Demo'));
  console.log(chalk.gray('═'.repeat(50)));
  console.log('');

  try {
    // Initialize the orchestrator
    console.log(chalk.yellow('Initializing AI Orchestration System...'));
    orchestrator = new AIOrchestrator();
    await orchestrator.initialize();
    console.log(chalk.green('✅ System initialized successfully'));
    console.log('');

    // Show system status
    console.log(chalk.blue('📊 System Status:'));
    const status = orchestrator.getStatus();
    
    Object.entries(status).forEach(([toolId, toolStatus]) => {
      const statusText = toolStatus.status.status === 'ready' ? 'Ready' : 'Not Ready';
      const statusColor = toolStatus.status.status === 'ready' ? chalk.green : chalk.red;
      
      console.log(chalk.blue(`\n${toolStatus.name} (${toolId}):`));
      console.log(`  Status: ${statusColor(statusText)}`);
      console.log(`  Capabilities: ${toolStatus.capabilities.join(', ')}`);
    });

    console.log('');
    console.log(chalk.green('🎉 Demo completed successfully!'));
    console.log('');
    console.log(chalk.yellow('Next steps:'));
    console.log('1. Add your API keys to the .env file');
    console.log('2. Run: npm run ai-orchestration:delegate "Your task here"');
    console.log('3. Try: npm run ai-orchestration:test');

  } catch (error) {
    console.error(chalk.red('❌ Demo failed:'), error.message);
    process.exit(1);
  } finally {
    // Cleanup
    if (orchestrator) {
      await orchestrator.shutdown();
    }
  }
}

// Run the demo
runDemo().catch(error => {
  console.error(chalk.red('Demo failed:'), error.message);
  process.exit(1);
});
