/**
 * CargoWise Integration Workflow Example
 * Demonstrates how to use the AI orchestration system with CargoWise integration
 */

const { EnhancedAIOrchestrator } = require('../src/enhanced-orchestrator');
const chalk = require('chalk');

async function demonstrateCargoWiseWorkflow() {
  console.log(chalk.blue('🚀 CargoWise AI Orchestration Workflow Example\n'));
  
  // Initialize the enhanced orchestrator
  const orchestrator = new EnhancedAIOrchestrator();
  
  try {
    // Initialize the system
    console.log(chalk.yellow('Initializing AI Orchestration System...'));
    await orchestrator.initialize();
    
    // Example 1: Schema Mapping Task
    console.log(chalk.green('\n📋 Example 1: AI Schema Mapping'));
    const mappingTask = `
    Create a schema mapping between Shopify order data and CargoWise shipment format.
    
    Source Schema (Shopify):
    - id: string
    - name: string (order number)
    - created_at: ISO timestamp
    - shipping_address: object with company, name, address1, city, province_code, zip, country_code
    - line_items: array of objects with sku, quantity, name
    
    Target Schema (CargoWise):
    - orderRef: string
    - createdAt: ISO timestamp
    - shipTo: object with company, name, address1, city, state, postalCode, country
    - lines: array of objects with sku, qtyOrdered, title
    - warehouseCode: string
    - pickMethod: string
    
    Please provide the mapping rules and any necessary transformations.
    `;
    
    const mappingResult = await orchestrator.delegateTask(mappingTask, {
      workflow: 'cargowise',
      priority: 'high',
      context: {
        integrationType: 'cargowise',
        sourceSystem: 'shopify',
        targetSystem: 'cargowise'
      }
    });
    
    console.log(chalk.blue('AI Response:'));
    console.log(mappingResult.response);
    
    // Example 2: Data Transformation Task
    console.log(chalk.green('\n🔄 Example 2: Data Transformation'));
    const transformTask = `
    Generate JSONata transformation expressions for the following Shopify to CargoWise mapping:
    
    - Map Shopify 'id' to CargoWise 'orderRef' with prefix 'SHOP-'
    - Transform Shopify 'shipping_address.province_code' to CargoWise 'shipTo.state'
    - Convert Shopify 'line_items' array to CargoWise 'lines' array
    - Set default 'warehouseCode' to 'MAIN-WH'
    - Set default 'pickMethod' to 'SINGLE'
    
    Provide the complete JSONata expressions.
    `;
    
    const transformResult = await orchestrator.delegateTask(transformTask, {
      workflow: 'cargowise',
      priority: 'normal',
      context: {
        integrationType: 'cargowise',
        mappingRules: mappingResult.response
      }
    });
    
    console.log(chalk.blue('AI Response:'));
    console.log(transformResult.response);
    
    // Example 3: Validation and Error Handling
    console.log(chalk.green('\n✅ Example 3: Validation and Error Handling'));
    const validationTask = `
    Analyze this CargoWise integration error and provide a solution:
    
    Error: "Validation failed: shipTo.postalCode is required"
    Context: Shopify order with shipping address zip code "10001-1234"
    
    The issue is that CargoWise expects a simple postal code format, but Shopify provides
    extended zip codes with additional digits. Provide a solution for handling this
    data format mismatch.
    `;
    
    const validationResult = await orchestrator.delegateTask(validationTask, {
      workflow: 'cargowise',
      priority: 'high',
      context: {
        integrationType: 'cargowise',
        errorType: 'validation',
        sourceSystem: 'shopify'
      }
    });
    
    console.log(chalk.blue('AI Response:'));
    console.log(validationResult.response);
    
    // Example 4: Research and Best Practices
    console.log(chalk.green('\n🔍 Example 4: Research and Best Practices'));
    const researchTask = `
    Research current best practices for CargoWise eAdaptor integration, including:
    - Authentication methods and security considerations
    - Error handling and retry strategies
    - Performance optimization techniques
    - Common integration patterns and anti-patterns
    
    Focus on production-ready implementations and real-world experience.
    `;
    
    const researchResult = await orchestrator.delegateTask(researchTask, {
      workflow: 'research',
      priority: 'normal',
      context: {
        integrationType: 'cargowise',
        researchType: 'best_practices'
      }
    });
    
    console.log(chalk.blue('AI Response:'));
    console.log(researchResult.response);
    
    // Example 5: Parallel Task Execution
    console.log(chalk.green('\n⚡ Example 5: Parallel Task Execution'));
    const parallelTasks = [
      {
        task: 'Generate test data for Shopify order schema with realistic values',
        workflow: 'cargowise',
        priority: 'normal'
      },
      {
        task: 'Create validation rules for CargoWise shipment data',
        workflow: 'cargowise',
        priority: 'normal'
      },
      {
        task: 'Research CargoWise API rate limits and throttling policies',
        workflow: 'research',
        priority: 'low'
      }
    ];
    
    console.log(chalk.yellow('Executing parallel tasks...'));
    const parallelResults = await orchestrator.executeParallelTasks(parallelTasks);
    
    parallelResults.forEach((result, index) => {
      console.log(chalk.blue(`\nTask ${index + 1}: ${result.task.task}`));
      console.log(chalk.gray(`Tool: ${result.result.tool}`));
      console.log(result.result.response);
      console.log(chalk.gray('─'.repeat(50)));
    });
    
    // Example 6: Integration Workflow Creation
    console.log(chalk.green('\n🏗️ Example 6: Integration Workflow Creation'));
    const workflowConfig = {
      sourceSystem: 'shopify',
      targetSystem: 'cargowise',
      sourceSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          shipping_address: {
            type: 'object',
            properties: {
              company: { type: 'string' },
              name: { type: 'string' },
              address1: { type: 'string' },
              city: { type: 'string' },
              province_code: { type: 'string' },
              zip: { type: 'string' },
              country_code: { type: 'string' }
            }
          },
          line_items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                sku: { type: 'string' },
                quantity: { type: 'integer' },
                name: { type: 'string' }
              }
            }
          }
        }
      },
      targetSchema: {
        type: 'object',
        properties: {
          orderRef: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          shipTo: {
            type: 'object',
            properties: {
              company: { type: 'string' },
              name: { type: 'string' },
              address1: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              postalCode: { type: 'string' },
              country: { type: 'string' }
            }
          },
          lines: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                sku: { type: 'string' },
                qtyOrdered: { type: 'integer' },
                title: { type: 'string' }
              }
            }
          },
          warehouseCode: { type: 'string' },
          pickMethod: { type: 'string' }
        }
      },
      sampleData: {
        id: '12345',
        name: '#ORDER-001',
        created_at: '2024-01-01T10:30:00Z',
        shipping_address: {
          company: 'Acme Corp',
          name: 'John Doe',
          address1: '123 Main St',
          city: 'New York',
          province_code: 'NY',
          zip: '10001',
          country_code: 'US'
        },
        line_items: [
          {
            sku: 'ABC-123',
            quantity: 2,
            name: 'Widget Pro'
          }
        ]
      }
    };
    
    try {
      const workflow = await orchestrator.createIntegrationWorkflow(workflowConfig);
      console.log(chalk.blue('Workflow created:'));
      console.log(JSON.stringify(workflow, null, 2));
      
      // Execute the workflow
      console.log(chalk.yellow('\nExecuting workflow...'));
      const executionResult = await orchestrator.executeWorkflow(workflow.id, workflowConfig.sampleData);
      console.log(chalk.blue('Workflow execution result:'));
      console.log(JSON.stringify(executionResult, null, 2));
      
    } catch (error) {
      console.log(chalk.red('Workflow creation/execution failed:'), error.message);
    }
    
    // Get system status
    console.log(chalk.green('\n📊 System Status'));
    const status = await orchestrator.getIntegrationStatus();
    console.log(chalk.blue('Orchestrator Status:'));
    console.log(JSON.stringify(status.orchestrator, null, 2));
    
    if (status.cargowise) {
      console.log(chalk.blue('\nCargoWise Integration Status:'));
      console.log(JSON.stringify(status.cargowise, null, 2));
    }
    
    console.log(chalk.green('\n✅ CargoWise workflow demonstration completed successfully!'));
    
  } catch (error) {
    console.error(chalk.red('❌ Workflow demonstration failed:'), error.message);
  } finally {
    // Cleanup
    await orchestrator.shutdown();
  }
}

// Run the example if called directly
if (require.main === module) {
  demonstrateCargoWiseWorkflow().catch(error => {
    console.error(chalk.red('Example failed:'), error.message);
    process.exit(1);
  });
}

module.exports = { demonstrateCargoWiseWorkflow };
