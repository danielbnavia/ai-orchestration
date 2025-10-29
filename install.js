#!/usr/bin/env node

/**
 * AI Orchestration Installation Script
 * Installs dependencies and sets up the AI orchestration system
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class AIOrchestrationInstaller {
  constructor() {
    this.projectRoot = process.cwd();
  }

  async run() {
    console.log('🚀 AI Orchestration System Installation');
    console.log('=====================================\n');

    try {
      // Step 1: Install dependencies
      await this.installDependencies();
      
      // Step 2: Create necessary directories
      await this.createDirectories();
      
      // Step 3: Create basic .env file if it doesn't exist
      await this.createBasicEnvFile();
      
      console.log('\n✅ Installation completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Edit .env file with your API keys');
      console.log('2. Run: node setup.js (for interactive configuration)');
      console.log('3. Or run: npm run ai-orchestration:start');
      
    } catch (error) {
      console.error('\n❌ Installation failed:', error.message);
      process.exit(1);
    }
  }

  async installDependencies() {
    console.log('📦 Installing dependencies...');
    
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['install'], {
        stdio: 'inherit',
        shell: true
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Dependencies installed successfully');
          resolve();
        } else {
          reject(new Error(`npm install failed with code ${code}`));
        }
      });
      
      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async createDirectories() {
    console.log('📁 Creating directories...');
    
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
        console.log(`   Created: ${dir}/`);
      } catch (error) {
        if (error.code !== 'EEXIST') {
          throw error;
        }
      }
    }
    
    console.log('✅ Directories created');
  }

  async createBasicEnvFile() {
    const envPath = path.join(this.projectRoot, '.env');
    
    try {
      await fs.access(envPath);
      console.log('📝 .env file already exists, skipping creation');
      return;
    } catch {
      // .env doesn't exist, create it
    }
    
    console.log('📝 Creating basic .env file...');
    
    const envContent = `# AI Orchestration System Configuration
# Generated on ${new Date().toISOString()}

# AI Service API Keys (add your keys here)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=
CURSOR_API_KEY=
PERPLEXITY_API_KEY=

# CargoWise Integration
CARGOWISE_SERVICE_URL=http://localhost:8080
CARGOWISE_API_KEY=

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
    
    await fs.writeFile(envPath, envContent);
    console.log('✅ Basic .env file created');
  }
}

// Run installation if called directly
if (require.main === module) {
  const installer = new AIOrchestrationInstaller();
  installer.run().catch(error => {
    console.error('Installation failed:', error.message);
    process.exit(1);
  });
}

module.exports = AIOrchestrationInstaller;
