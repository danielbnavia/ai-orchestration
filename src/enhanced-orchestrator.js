/**
 * Enhanced AI Orchestrator with CargoWise Integration
 * Coordinates multiple AI tools with existing CargoWise warehouse integration
 */

const AIOrchestrator = require('./orchestrator');
const CargoWiseIntegration = require('./cargowise-integration');
const winston = require('winston');

class EnhancedAIOrchestrator extends AIOrchestrator {
  constructor() {
    super();
    this.cargowiseIntegration = null;
    this.workflows = new Map();
    this.integrationTasks = new Map();
  }

  /**
   * Initialize enhanced orchestrator with CargoWise integration
   */
  async initialize() {
    await super.initialize();
    
    // Initialize CargoWise integration
    try {
      this.cargowiseIntegration = new CargoWiseIntegration({
        cargowiseServiceUrl: process.env.CARGOWISE_SERVICE_URL || 'http://localhost:8080',
        apiKey: process.env.CARGOWISE_API_KEY
      });
      
      await this.cargowiseIntegration.initialize();
      this.logger.info('CargoWise integration initialized');
    } catch (error) {
      this.logger.warn('CargoWise integration failed to initialize:', error.message);
    }
  }

  /**
   * Delegate task with CargoWise integration awareness
   */
  async delegateTask(task, options = {}) {
    const { workflow, priority, context, integrationType } = options;
    
    // Check if this is a CargoWise-related task
    if (this.isCargoWiseTask(task, integrationType)) {
      return await this.delegateCargoWiseTask(task, options);
    }
    
    // Use standard delegation for other tasks
    return await super.delegateTask(task, options);
  }

  /**
   * Check if task is CargoWise-related
   */
  isCargoWiseTask(task, integrationType) {
    const cargowiseKeywords = [
      'cargowise', 'cw1', 'warehouse', 'logistics', 'shipment', 'order',
      'schema mapping', 'data transformation', 'integration', 'edi',
      'shopify', 'machship', 'consignment', 'freight'
    ];
    
    const taskLower = task.toLowerCase();
    return cargowiseKeywords.some(keyword => taskLower.includes(keyword)) ||
           integrationType === 'cargowise';
  }

  /**
   * Delegate CargoWise-specific tasks
   */
  async delegateCargoWiseTask(task, options) {
    const { context, priority } = options;
    
    if (!this.cargowiseIntegration) {
      throw new Error('CargoWise integration not available');
    }

    // Determine the best AI tool for CargoWise tasks
    const selectedTool = this.selectCargoWiseTool(task);
    const manager = this.aiTools.get(selectedTool);
    
    if (!manager) {
      throw new Error(`AI tool ${selectedTool} not available`);
    }

    // Create enhanced task with CargoWise context
    const taskObj = {
      id: this.generateTaskId(),
      task,
      tool: selectedTool,
      workflow: 'cargowise',
      priority: priority || 'normal',
      context: {
        ...context,
        cargowiseIntegration: this.cargowiseIntegration,
        availableSchemas: await this.getAvailableSchemas(),
        integrationCapabilities: this.getIntegrationCapabilities()
      },
      timestamp: new Date(),
      status: 'pending'
    };

    this.logger.info(`Delegating CargoWise task to ${selectedTool}: ${task}`);
    
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
   * Select best AI tool for CargoWise tasks
   */
  selectCargoWiseTool(task) {
    const taskLower = task.toLowerCase();
    
    // Schema mapping and data transformation - use Claude for complex reasoning
    if (taskLower.includes('schema') || taskLower.includes('mapping') || 
        taskLower.includes('transformation') || taskLower.includes('validation')) {
      return this.aiTools.has('claude') ? 'claude' : 'openai';
    }
    
    // Code generation and API development - use OpenAI
    if (taskLower.includes('generate') || taskLower.includes('create') || 
        taskLower.includes('api') || taskLower.includes('code')) {
      return this.aiTools.has('openai') ? 'openai' : 'claude';
    }
    
    // Research and documentation - use Perplexity for current info
    if (taskLower.includes('research') || taskLower.includes('documentation') || 
        taskLower.includes('best practices') || taskLower.includes('standards')) {
      return this.aiTools.has('perplexity') ? 'perplexity' : 'gemini';
    }
    
    // Large context and multimodal tasks - use Gemini
    if (taskLower.includes('large') || taskLower.includes('multimodal') || 
        taskLower.includes('analysis') || taskLower.includes('complex')) {
      return this.aiTools.has('gemini') ? 'gemini' : 'claude';
    }
    
    // IDE integration and real-time assistance - use Cursor
    if (taskLower.includes('ide') || taskLower.includes('debug') || 
        taskLower.includes('refactor') || taskLower.includes('completion')) {
      return this.aiTools.has('cursor') ? 'cursor' : 'openai';
    }
    
    // Default to Claude for complex CargoWise tasks
    return this.aiTools.has('claude') ? 'claude' : this.aiTools.keys().next().value;
  }

  /**
   * Get available schemas from CargoWise service
   */
  async getAvailableSchemas() {
    if (!this.cargowiseIntegration) {
      return [];
    }
    
    try {
      const schemas = await this.cargowiseIntegration.getCanonicalSchemas();
      return schemas.canonical_schemas || [];
    } catch (error) {
      this.logger.warn('Failed to get available schemas:', error.message);
      return [];
    }
  }

  /**
   * Get integration capabilities
   */
  getIntegrationCapabilities() {
    return {
      schemaMapping: true,
      dataTransformation: true,
      validation: true,
      orderCreation: true,
      shopifyIntegration: true,
      testDataGeneration: true,
      eventMonitoring: true,
      triageAnalysis: true
    };
  }

  /**
   * Create integration workflow
   */
  async createIntegrationWorkflow(workflowConfig) {
    if (!this.cargowiseIntegration) {
      throw new Error('CargoWise integration not available');
    }
    
    try {
      const workflow = await this.cargowiseIntegration.createIntegrationWorkflow(workflowConfig);
      this.workflows.set(workflow.id, workflow);
      
      this.logger.info(`Integration workflow created: ${workflow.id}`);
      return workflow;
    } catch (error) {
      this.logger.error('Failed to create integration workflow:', error);
      throw error;
    }
  }

  /**
   * Execute integration workflow
   */
  async executeWorkflow(workflowId, data) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }
    
    if (!this.cargowiseIntegration) {
      throw new Error('CargoWise integration not available');
    }
    
    try {
      const result = await this.cargowiseIntegration.executeWorkflow(workflow, data);
      
      this.logger.info(`Workflow ${workflowId} executed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to execute workflow ${workflowId}:`, error);
      throw error;
    }
  }

  /**
   * Get integration status
   */
  async getIntegrationStatus() {
    const status = {
      orchestrator: this.getStatus(),
      cargowise: null,
      workflows: Array.from(this.workflows.values()).map(w => ({
        id: w.id,
        name: w.name,
        status: w.status,
        created_at: w.created_at
      }))
    };
    
    if (this.cargowiseIntegration) {
      try {
        status.cargowise = await this.cargowiseIntegration.getAIServiceStatus();
      } catch (error) {
        status.cargowise = { status: 'unhealthy', error: error.message };
      }
    }
    
    return status;
  }

  /**
   * Monitor integration events
   */
  async monitorIntegrationEvents(options = {}) {
    if (!this.cargowiseIntegration) {
      throw new Error('CargoWise integration not available');
    }
    
    try {
      const events = await this.cargowiseIntegration.getIntegrationEvents(options);
      
      // Process events and trigger appropriate AI responses
      for (const event of events.events || []) {
        await this.processIntegrationEvent(event);
      }
      
      return events;
    } catch (error) {
      this.logger.error('Failed to monitor integration events:', error);
      throw error;
    }
  }

  /**
   * Process integration event and trigger AI response
   */
  async processIntegrationEvent(event) {
    const { type, data, severity } = event;
    
    // Determine if AI intervention is needed
    if (severity === 'error' || severity === 'critical') {
      const task = `Analyze and provide solution for integration error: ${type}. Data: ${JSON.stringify(data)}`;
      
      try {
        const result = await this.delegateTask(task, {
          workflow: 'cargowise',
          priority: 'high',
          context: { event, integrationType: 'cargowise' }
        });
        
        this.logger.info(`AI response generated for event ${event.id}:`, result.response);
        
        // Store AI response for triage
        this.integrationTasks.set(event.id, {
          event,
          aiResponse: result,
          timestamp: new Date()
        });
        
      } catch (error) {
        this.logger.error(`Failed to generate AI response for event ${event.id}:`, error);
      }
    }
  }

  /**
   * Get triage summary with AI insights
   */
  async getTriageSummary(hours = 24) {
    if (!this.cargowiseIntegration) {
      throw new Error('CargoWise integration not available');
    }
    
    try {
      const triageData = await this.cargowiseIntegration.getTriageSummary(hours);
      
      // Enhance with AI insights
      const aiInsights = await this.generateTriageInsights(triageData);
      
      return {
        ...triageData,
        aiInsights
      };
    } catch (error) {
      this.logger.error('Failed to get triage summary:', error);
      throw error;
    }
  }

  /**
   * Generate AI insights for triage data
   */
  async generateTriageInsights(triageData) {
    const task = `Analyze integration triage data and provide insights and recommendations. Data: ${JSON.stringify(triageData)}`;
    
    try {
      const result = await this.delegateTask(task, {
        workflow: 'cargowise',
        priority: 'normal',
        context: { triageData, integrationType: 'cargowise' }
      });
      
      return {
        insights: result.response,
        generatedBy: result.tool,
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error('Failed to generate triage insights:', error);
      return {
        insights: 'Unable to generate AI insights',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Shutdown enhanced orchestrator
   */
  async shutdown() {
    await super.shutdown();
    
    if (this.cargowiseIntegration) {
      this.logger.info('CargoWise integration shutdown');
    }
    
    this.workflows.clear();
    this.integrationTasks.clear();
  }
}

module.exports = EnhancedAIOrchestrator;
