import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { CURRENT_ACAD_YEAR } from '@/config/constants.js';

export const tools: Tool[] = [
  {
    name: 'search_modules',
    description: 'Search for modules by title or code',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (module code or title keyword)',
        },
        acadYear: {
          type: 'string',
          description: 'Academic year (e.g., "2024-2025")',
          default: CURRENT_ACAD_YEAR,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_module_info',
    description: 'Get detailed information about a specific module',
    inputSchema: {
      type: 'object',
      properties: {
        moduleCode: {
          type: 'string',
          description: 'Module code (e.g., "CS1010S")',
        },
        acadYear: {
          type: 'string',
          description: 'Academic year',
          default: CURRENT_ACAD_YEAR,
        },
      },
      required: ['moduleCode'],
    },
  },
  {
    name: 'get_module_timetable',
    description: 'Get the timetable for a specific module',
    inputSchema: {
      type: 'object',
      properties: {
        moduleCode: {
          type: 'string',
          description: 'Module code',
        },
        acadYear: {
          type: 'string',
          description: 'Academic year',
          default: CURRENT_ACAD_YEAR,
        },
        semester: {
          type: 'number',
          description: 'Semester (1 or 2)',
        },
      },
      required: ['moduleCode', 'semester'],
    },
  },
  {
    name: 'get_module_prerequisites',
    description: 'Get prerequisites and modules that this module fulfills',
    inputSchema: {
      type: 'object',
      properties: {
        moduleCode: {
          type: 'string',
          description: 'Module code',
        },
        acadYear: {
          type: 'string',
          description: 'Academic year',
          default: CURRENT_ACAD_YEAR,
        },
      },
      required: ['moduleCode'],
    },
  },
  {
    name: 'list_modules_by_department',
    description: 'List all modules offered by a specific department',
    inputSchema: {
      type: 'object',
      properties: {
        department: {
          type: 'string',
          description: 'Department name',
        },
        acadYear: {
          type: 'string',
          description: 'Academic year',
          default: CURRENT_ACAD_YEAR,
        },
      },
      required: ['department'],
    },
  },
  {
    name: 'get_venue_schedule',
    description: 'Get the schedule of classes in a specific venue',
    inputSchema: {
      type: 'object',
      properties: {
        venue: {
          type: 'string',
          description: 'Venue code (e.g., "COM1-0207")',
        },
        acadYear: {
          type: 'string',
          description: 'Academic year',
          default: CURRENT_ACAD_YEAR,
        },
        semester: {
          type: 'number',
          description: 'Semester (1 or 2)',
        },
      },
      required: ['venue', 'semester'],
    },
  },
  {
    name: 'list_all_venues',
    description: 'List all venues used in a semester',
    inputSchema: {
      type: 'object',
      properties: {
        acadYear: {
          type: 'string',
          description: 'Academic year',
          default: CURRENT_ACAD_YEAR,
        },
        semester: {
          type: 'number',
          description: 'Semester (1 or 2)',
        },
      },
      required: ['semester'],
    },
  },
  {
    name: 'check_module_availability',
    description: 'Check if a module is offered in a specific semester',
    inputSchema: {
      type: 'object',
      properties: {
        moduleCode: {
          type: 'string',
          description: 'Module code',
        },
        acadYear: {
          type: 'string',
          description: 'Academic year',
          default: CURRENT_ACAD_YEAR,
        },
        semester: {
          type: 'number',
          description: 'Semester to check',
        },
      },
      required: ['moduleCode', 'semester'],
    },
  },
  {
    name: 'get_module_workload',
    description: 'Get the workload breakdown for a module',
    inputSchema: {
      type: 'object',
      properties: {
        moduleCode: {
          type: 'string',
          description: 'Module code',
        },
        acadYear: {
          type: 'string',
          description: 'Academic year',
          default: CURRENT_ACAD_YEAR,
        },
      },
      required: ['moduleCode'],
    },
  },
  {
    name: 'find_conflicting_modules',
    description: 'Find modules that have preclusions with the given module',
    inputSchema: {
      type: 'object',
      properties: {
        moduleCode: {
          type: 'string',
          description: 'Module code',
        },
        acadYear: {
          type: 'string',
          description: 'Academic year',
          default: CURRENT_ACAD_YEAR,
        },
      },
      required: ['moduleCode'],
    },
  },
];