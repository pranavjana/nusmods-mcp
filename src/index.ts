import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { NUSModsApiClient } from '@/utils/api-client.js';
import { ToolHandlers } from '@/handlers/tools.js';
import { tools } from '@/tools/definitions.js';
import { SERVER_CONFIG, CURRENT_ACAD_YEAR } from '@/config/constants.js';

class NUSModsServer {
  private server: Server;
  private apiClient: NUSModsApiClient;
  private handlers: ToolHandlers;

  constructor() {
    this.server = new Server(
      SERVER_CONFIG,
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiClient = new NUSModsApiClient();
    this.handlers = new ToolHandlers(this.apiClient);
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (!args) {
          throw new Error('Missing arguments');
        }

        switch (name) {
          case 'search_modules':
            return await this.handlers.searchModules(args.query as string, args.acadYear as string);
          
          case 'get_module_info':
            return await this.handlers.getModuleInfo(args.moduleCode as string, args.acadYear as string);
          
          case 'get_module_timetable':
            return await this.handlers.getModuleTimetable(
              args.moduleCode as string, 
              args.acadYear as string, 
              args.semester as number
            );
          
          case 'get_module_prerequisites':
            return await this.handlers.getModulePrerequisites(args.moduleCode as string, args.acadYear as string);
          
          case 'list_modules_by_department':
            return await this.handlers.listModulesByDepartment(args.department as string, args.acadYear as string);
          
          case 'get_venue_schedule':
            return await this.handlers.getVenueSchedule(
              args.venue as string, 
              args.acadYear as string, 
              args.semester as number
            );
          
          case 'list_all_venues':
            return await this.handlers.listAllVenues(args.acadYear as string, args.semester as number);
          
          case 'check_module_availability':
            return await this.handlers.checkModuleAvailability(
              args.moduleCode as string, 
              args.acadYear as string, 
              args.semester as number
            );
          
          case 'get_module_workload':
            return await this.handlers.getModuleWorkload(args.moduleCode as string, args.acadYear as string);
          
          case 'find_conflicting_modules':
            return await this.handlers.findConflictingModules(args.moduleCode as string, args.acadYear as string);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
            },
          ],
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('NUSMods MCP server running on stdio');
  }
}

const server = new NUSModsServer();
server.run().catch(console.error);