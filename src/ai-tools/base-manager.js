/**
 * Base AI Tool Manager
 * Abstract base class for all AI tool managers
 */

const EventEmitter = require('events');
const { spawn } = require('child_process');
const winston = require('winston');

class BaseAIManager extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.status = 'idle';
    this.lastActivity = null;
    this.activeTasks = new Map();
    
    // Setup logger
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.label({ label: this.config.name }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: `logs/${this.config.name.toLowerCase()}.log` }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });
  }

  /**
   * Initialize the AI tool
   */
  async initialize() {
    this.logger.info('Initializing AI tool');
    this.status = 'ready';
    this.emit('statusChange', this.status);
  }

  /**
   * Execute a task
   */
  async executeTask(task) {
    this.logger.info(`Executing task: ${task.task}`);
    this.status = 'busy';
    this.lastActivity = new Date();
    this.activeTasks.set(task.id, task);
    
    this.emit('statusChange', this.status);
    
    try {
      const result = await this.processTask(task);
      
      this.status = 'ready';
      this.activeTasks.delete(task.id);
      this.emit('statusChange', this.status);
      this.emit('taskComplete', result);
      
      return result;
    } catch (error) {
      this.status = 'error';
      this.activeTasks.delete(task.id);
      this.emit('statusChange', this.status);
      this.emit('taskError', error);
      throw error;
    }
  }

  /**
   * Process task - to be implemented by subclasses
   */
  async processTask(task) {
    throw new Error('processTask must be implemented by subclass');
  }

  /**
   * Execute CLI command
   */
  async executeCLI(command, args = [], input = null) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, ...this.getEnvironmentVariables() }
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`CLI command failed with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });

      // Send input if provided
      if (input) {
        child.stdin.write(input);
        child.stdin.end();
      }
    });
  }

  /**
   * Get environment variables for CLI execution
   */
  getEnvironmentVariables() {
    const env = {};
    
    // Add API key if configured
    if (this.config.config.apiKey) {
      const keyName = this.getAPIKeyEnvironmentVariable();
      if (keyName) {
        env[keyName] = this.config.config.apiKey;
      }
    }
    
    return env;
  }

  /**
   * Get API key environment variable name - to be implemented by subclasses
   */
  getAPIKeyEnvironmentVariable() {
    throw new Error('getAPIKeyEnvironmentVariable must be implemented by subclass');
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      status: this.status,
      activeTasks: this.activeTasks.size,
      lastActivity: this.lastActivity,
      capabilities: this.config.capabilities
    };
  }

  /**
   * Shutdown the AI tool
   */
  async shutdown() {
    this.logger.info('Shutting down AI tool');
    this.status = 'shutdown';
    this.emit('statusChange', this.status);
  }
}

module.exports = BaseAIManager;
