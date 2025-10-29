/**
 * AI Orchestration System
 * Central hub for coordinating multiple AI CLI tools
 */

const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const winston = require('winston');

// Import AI tool managers
const ClaudeManager = require('./ai-tools/claude-manager');
const OpenAIManager = require('./ai-tools/openai-manager');
const GeminiManager = require('./ai-tools/gemini-manager');
const CursorManager = require('./ai-tools/cursor-manager');
const PerplexityManager = require('./ai-tools/perplexity-manager');

class AIOrchestrator extends EventEmitter {
  constructor() {
    super();
    this.aiTools = new Map();
    this.activeSessions = new Map();
    this.taskQueue = [];
    this.isRunning = false;
    this.config = null;
    
    // Setup logger
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/ai-orchestration.log' }),
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
   * Initialize the orchestration system
   */
  async initialize() {
    const spinner = ora('Initializing AI Orchestration System...').start();
    
    try {
      // Load configuration
      await this.loadConfig();
      
      // Initialize AI tools
      await this.initializeAITools();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Start monitoring
      this.startMonitoring();
      
      spinner.succeed('AI Orchestration System initialized successfully');
      this.logger.info('AI Orchestration System initialized');
      
      return true;
    } catch (error) {
      spinner.fail('Failed to initialize AI Orchestration System');
      this.logger.error('Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load configuration from file
   */
  async loadConfig() {
    const configPath = path.join(__dirname, '../config/ai-tools.json');
    const configData = await fs.readFile(configPath, 'utf8');
    this.config = JSON.parse(configData);
  }

  /**
   * Initialize all AI tools
   */
  async initializeAITools() {
    const { aiTools } = this.config;
    
    for (const [toolId, toolConfig] of Object.entries(aiTools)) {
      if (!toolConfig.enabled) continue;
      
      try {
        let manager;
        
        switch (toolId) {
          case 'claude':
            manager = new ClaudeManager(toolConfig);
            break;
          case 'openai':
            manager = new OpenAIManager(toolConfig);
            break;
          case 'gemini':
            manager = new GeminiManager(toolConfig);
            break;
          case 'cursor':
            manager = new CursorManager(toolConfig);
            break;
          case 'perplexity':
            manager = new PerplexityManager(toolConfig);
            break;
          default:
            this.logger.warn(`Unknown AI tool: ${toolId}`);
            continue;
        }
        
        await manager.initialize();
        this.aiTools.set(toolId, manager);
        
        this.logger.info(`Initialized ${toolConfig.name} (${toolId})`);
      } catch (error) {
        this.logger.error(`Failed to initialize ${toolId}:`, error);
      }
    }
  }

  /**
   * Setup event listeners for AI tools
   */
  setupEventListeners() {
    this.aiTools.forEach((manager, toolId) => {
      manager.on('taskComplete', (result) => {
        this.emit('taskComplete', { toolId, result });
      });
      
      manager.on('taskError', (error) => {
        this.emit('taskError', { toolId, error });
      });
      
      manager.on('statusChange', (status) => {
        this.emit('statusChange', { toolId, status });
      });
    });
  }

  /**
   * Delegate a task to the most appropriate AI tool
   */
  async delegateTask(task, options = {}) {
    const { workflow, priority, context } = options;
    
    // Determine the best AI tool for this task
    const selectedTool = this.selectBestTool(task, workflow);
    
    if (!selectedTool) {
      throw new Error('No suitable AI tool available for this task');
    }
    
    const manager = this.aiTools.get(selectedTool);
    if (!manager) {
      throw new Error(`AI tool ${selectedTool} not available`);
    }
    
    // Create task object
    const taskObj = {
      id: this.generateTaskId(),
      task,
      tool: selectedTool,
      workflow,
      priority: priority || 'normal',
      context,
      timestamp: new Date(),
      status: 'pending'
    };
    
    this.logger.info(`Delegating task to ${selectedTool}: ${task}`);
    
    try {
      const result = await manager.executeTask(taskObj);
      taskObj.status = 'completed';
      taskObj.result = result;
      
      this.emit('taskComplete', { toolId: selectedTool, task: taskObj });
      return result;
    } catch (error) {
      taskObj.status = 'failed';
      taskObj.error = error;
      
      this.emit('taskError', { toolId: selectedTool, task: taskObj });
      throw error;
    }
  }

  /**
   * Execute tasks in parallel across multiple AI tools
   */
  async executeParallelTasks(tasks, options = {}) {
    const { maxConcurrent = 3 } = options;
    
    this.logger.info(`Executing ${tasks.length} tasks in parallel`);
    
    const results = [];
    const executing = new Set();
    
    for (let i = 0; i < tasks.length; i++) {
      if (executing.size >= maxConcurrent) {
        await Promise.race(executing);
      }
      
      const task = tasks[i];
      const promise = this.delegateTask(task.task, {
        workflow: task.workflow,
        priority: task.priority,
        context: task.context
      }).then(result => {
        executing.delete(promise);
        return { task, result };
      }).catch(error => {
        executing.delete(promise);
        return { task, error };
      });
      
      executing.add(promise);
      results.push(promise);
    }
    
    return Promise.all(results);
  }

  /**
   * Select the best AI tool for a given task
   */
  selectBestTool(task, workflow) {
    const { workflows } = this.config;
    
    // If workflow is specified, use workflow configuration
    if (workflow && workflows[workflow]) {
      const workflowConfig = workflows[workflow];
      const primary = workflowConfig.primary;
      
      if (this.aiTools.has(primary)) {
        return primary;
      }
      
      // Try secondary tools
      for (const secondary of workflowConfig.secondary) {
        if (this.aiTools.has(secondary)) {
          return secondary;
        }
      }
      
      // Try fallback
      if (this.aiTools.has(workflowConfig.fallback)) {
        return workflowConfig.fallback;
      }
    }
    
    // Default selection based on task content
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes('search') || taskLower.includes('research') || taskLower.includes('web')) {
      return this.aiTools.has('perplexity') ? 'perplexity' : null;
    }
    
    if (taskLower.includes('review') || taskLower.includes('analyze') || taskLower.includes('security')) {
      return this.aiTools.has('claude') ? 'claude' : null;
    }
    
    if (taskLower.includes('generate') || taskLower.includes('create') || taskLower.includes('write')) {
      return this.aiTools.has('openai') ? 'openai' : null;
    }
    
    if (taskLower.includes('multimodal') || taskLower.includes('image') || taskLower.includes('large context')) {
      return this.aiTools.has('gemini') ? 'gemini' : null;
    }
    
    // Default to first available tool
    return this.aiTools.keys().next().value;
  }

  /**
   * Get status of all AI tools
   */
  getStatus() {
    const status = {};
    
    this.aiTools.forEach((manager, toolId) => {
      status[toolId] = {
        name: manager.config.name,
        status: manager.getStatus(),
        capabilities: manager.config.capabilities,
        lastActivity: manager.lastActivity
      };
    });
    
    return status;
  }

  /**
   * Start monitoring system
   */
  startMonitoring() {
    const { monitoring } = this.config.orchestration;
    
    if (!monitoring.enabled) return;
    
    setInterval(() => {
      this.logger.info('AI Tools Status:', this.getStatus());
    }, monitoring.metricsInterval);
  }

  /**
   * Generate unique task ID
   */
  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Shutdown the orchestration system
   */
  async shutdown() {
    this.logger.info('Shutting down AI Orchestration System...');
    
    for (const [toolId, manager] of this.aiTools) {
      try {
        await manager.shutdown();
        this.logger.info(`Shutdown ${toolId}`);
      } catch (error) {
        this.logger.error(`Error shutting down ${toolId}:`, error);
      }
    }
    
    this.aiTools.clear();
    this.logger.info('AI Orchestration System shutdown complete');
  }
}

module.exports = AIOrchestrator;
