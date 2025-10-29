/**
 * CargoWise Integration for AI Orchestration
 * Integrates with existing CargoWise AI warehouse integration system
 */

const axios = require('axios');
const EventEmitter = require('events');
const winston = require('winston');

class CargoWiseIntegration extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.baseUrl = config.cargowiseServiceUrl || 'http://localhost:8080';
    this.apiKey = config.apiKey;
    
    // Setup logger
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.label({ label: 'CargoWise-Integration' }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/cargowise-integration.log' }),
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
   * Initialize CargoWise integration
   */
  async initialize() {
    try {
      // Test connection to CargoWise service
      const healthResponse = await this.checkHealth();
      
      if (healthResponse.status === 'healthy') {
        this.logger.info('CargoWise integration initialized successfully');
        this.emit('initialized', { status: 'success' });
        return true;
      } else {
        this.logger.warn('CargoWise service is not healthy:', healthResponse);
        this.emit('initialized', { status: 'degraded', details: healthResponse });
        return false;
      }
    } catch (error) {
      this.logger.error('Failed to initialize CargoWise integration:', error);
      this.emit('initialized', { status: 'failed', error: error.message });
      throw error;
    }
  }

  /**
   * Check health of CargoWise service
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        timeout: 10000
      });
      
      return response.data;
    } catch (error) {
      this.logger.error('Health check failed:', error.message);
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  /**
   * Generate AI-assisted schema mapping
   */
  async generateSchemaMapping(sourceSchema, targetSchema, sampleData = null) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/mapping/generate`, {
        source_schema: sourceSchema,
        target_schema: targetSchema,
        sample_data: sampleData
      });

      this.logger.info('Schema mapping generated successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to generate schema mapping:', error.message);
      throw error;
    }
  }

  /**
   * Apply schema mapping to transform data
   */
  async applySchemaMapping(data, mapping) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/mapping/apply`, {
        data: data,
        mapping: mapping
      });

      this.logger.info('Schema mapping applied successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to apply schema mapping:', error.message);
      throw error;
    }
  }

  /**
   * Generate transformation template using AI
   */
  async generateTransformTemplate(sourceSchema, targetSchema, sampleData) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/transform/generate`, {
        source_schema: sourceSchema,
        target_schema: targetSchema,
        sample_data: sampleData
      });

      this.logger.info('Transform template generated successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to generate transform template:', error.message);
      throw error;
    }
  }

  /**
   * Apply transformation to data
   */
  async applyTransformation(data, template) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/transform/apply`, {
        data: data,
        template: template
      });

      this.logger.info('Transformation applied successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to apply transformation:', error.message);
      throw error;
    }
  }

  /**
   * Validate data against schema
   */
  async validateData(data, schemaPath) {
    try {
      const response = await axios.post(`${this.baseUrl}/validate/universal`, {
        data: data,
        schema_path: schemaPath
      });

      this.logger.info('Data validation completed');
      return response.data;
    } catch (error) {
      this.logger.error('Data validation failed:', error.message);
      throw error;
    }
  }

  /**
   * Create CargoWise order
   */
  async createCargoWiseOrder(orderData, options = {}) {
    try {
      const { validateFirst = true, variant = 'SHIPMENT' } = options;
      
      const response = await axios.post(`${this.baseUrl}/cw/create-order`, orderData, {
        params: {
          validate_first: validateFirst,
          variant: variant
        }
      });

      this.logger.info('CargoWise order created successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create CargoWise order:', error.message);
      throw error;
    }
  }

  /**
   * Ingest Shopify order and convert to canonical format
   */
  async ingestShopifyOrder(shopifyOrder) {
    try {
      const response = await axios.post(`${this.baseUrl}/ingest/shopify-order`, shopifyOrder);

      this.logger.info('Shopify order ingested successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to ingest Shopify order:', error.message);
      throw error;
    }
  }

  /**
   * Get available canonical schemas
   */
  async getCanonicalSchemas() {
    try {
      const response = await axios.get(`${this.baseUrl}/schemas/registry`);

      this.logger.info('Canonical schemas retrieved successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get canonical schemas:', error.message);
      throw error;
    }
  }

  /**
   * Get integration events for monitoring
   */
  async getIntegrationEvents(options = {}) {
    try {
      const { limit = 50, failed = false } = options;
      
      const endpoint = failed ? '/events/failed' : '/events';
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params: { limit }
      });

      this.logger.info('Integration events retrieved successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get integration events:', error.message);
      throw error;
    }
  }

  /**
   * Get triage summary for failed events
   */
  async getTriageSummary(hours = 24) {
    try {
      const response = await axios.get(`${this.baseUrl}/triage/summary`, {
        params: { hours }
      });

      this.logger.info('Triage summary retrieved successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get triage summary:', error.message);
      throw error;
    }
  }

  /**
   * Synthesize test data using AI
   */
  async synthesizeTestData(schemaPath, numSamples = 5) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/validation/synthesize`, {
        schema_path: schemaPath,
        num_samples: numSamples
      });

      this.logger.info('Test data synthesized successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to synthesize test data:', error.message);
      throw error;
    }
  }

  /**
   * Generate negative test cases
   */
  async generateNegativeTestCases(schemaPath) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/validation/negative-tests`, {
        schema_path: schemaPath
      });

      this.logger.info('Negative test cases generated successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to generate negative test cases:', error.message);
      throw error;
    }
  }

  /**
   * Get AI service status
   */
  async getAIServiceStatus() {
    try {
      const healthResponse = await this.checkHealth();
      
      return {
        cargowise_service: healthResponse.status,
        ai_features: healthResponse.ai_features || {},
        services: healthResponse.services || {},
        startup_validation: healthResponse.startup_validation || {}
      };
    } catch (error) {
      this.logger.error('Failed to get AI service status:', error.message);
      return {
        cargowise_service: 'unhealthy',
        error: error.message
      };
    }
  }

  /**
   * Create integration workflow
   */
  async createIntegrationWorkflow(workflowConfig) {
    try {
      const { sourceSystem, targetSystem, mappingRules, transformations } = workflowConfig;
      
      // Step 1: Generate schema mapping if not provided
      let mapping = mappingRules;
      if (!mapping) {
        const mappingResponse = await this.generateSchemaMapping(
          workflowConfig.sourceSchema,
          workflowConfig.targetSchema,
          workflowConfig.sampleData
        );
        mapping = mappingResponse.mapping;
      }

      // Step 2: Generate transformation templates if not provided
      let templates = transformations;
      if (!templates) {
        const templateResponse = await this.generateTransformTemplate(
          workflowConfig.sourceSchema,
          workflowConfig.targetSchema,
          workflowConfig.sampleData
        );
        templates = templateResponse.templates;
      }

      // Step 3: Create workflow definition
      const workflow = {
        id: `workflow_${Date.now()}`,
        name: `${sourceSystem}_to_${targetSystem}`,
        source_system: sourceSystem,
        target_system: targetSystem,
        mapping: mapping,
        transformations: templates,
        created_at: new Date().toISOString(),
        status: 'draft'
      };

      this.logger.info('Integration workflow created successfully');
      return workflow;
    } catch (error) {
      this.logger.error('Failed to create integration workflow:', error.message);
      throw error;
    }
  }

  /**
   * Execute integration workflow
   */
  async executeWorkflow(workflow, data) {
    try {
      this.logger.info(`Executing workflow: ${workflow.name}`);

      // Step 1: Apply schema mapping
      const mappedData = await this.applySchemaMapping(data, workflow.mapping);

      // Step 2: Apply transformations
      let transformedData = mappedData;
      for (const template of workflow.transformations) {
        transformedData = await this.applyTransformation(transformedData, template);
      }

      // Step 3: Validate final data
      const validationResult = await this.validateData(transformedData, workflow.targetSchema);

      this.logger.info('Workflow executed successfully');
      return {
        workflow_id: workflow.id,
        original_data: data,
        mapped_data: mappedData,
        transformed_data: transformedData,
        validation_result: validationResult,
        status: 'completed'
      };
    } catch (error) {
      this.logger.error('Failed to execute workflow:', error.message);
      throw error;
    }
  }
}

module.exports = CargoWiseIntegration;
