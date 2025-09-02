import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export interface SearchModulesParams {
  query?: string;
  department?: string;
  semester?: number;
  limit?: number;
}

export interface GetModuleInfoParams {
  moduleCode: string;
  acadYear?: string;
}

export interface GetModuleTimetableParams {
  moduleCode: string;
  semester: number;
  acadYear?: string;
}

export interface GetModulePrerequisitesParams {
  moduleCode: string;
  acadYear?: string;
}

export interface ListModulesByDepartmentParams {
  department: string;
  semester?: number;
  acadYear?: string;
}

export interface GetVenueScheduleParams {
  venue: string;
  semester: number;
  acadYear?: string;
}

export interface ListAllVenuesParams {
  semester: number;
  acadYear?: string;
}

export interface CheckModuleAvailabilityParams {
  moduleCode: string;
  semester: number;
  acadYear?: string;
}

export interface GetModuleWorkloadParams {
  moduleCode: string;
  acadYear?: string;
}

export interface FindConflictingModulesParams {
  moduleCode: string;
  acadYear?: string;
}

export type ToolParams = 
  | SearchModulesParams
  | GetModuleInfoParams
  | GetModuleTimetableParams
  | GetModulePrerequisitesParams
  | ListModulesByDepartmentParams
  | GetVenueScheduleParams
  | ListAllVenuesParams
  | CheckModuleAvailabilityParams
  | GetModuleWorkloadParams
  | FindConflictingModulesParams;

export interface NUSModsTool extends Tool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}