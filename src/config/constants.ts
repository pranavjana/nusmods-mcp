export const API_BASE_URL = process.env.NUSMODS_API_BASE_URL || 'https://api.nusmods.com/v2';
export const CURRENT_ACAD_YEAR = process.env.CURRENT_ACAD_YEAR || '2024-2025';
export const DEFAULT_SEARCH_LIMIT = parseInt(process.env.DEFAULT_SEARCH_LIMIT || '20', 10);
export const DEFAULT_PREVIEW_LIMIT = parseInt(process.env.DEFAULT_PREVIEW_LIMIT || '10', 10);

export const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const SERVER_CONFIG = {
  name: 'nusmods-mcp',
  version: '1.0.0',
} as const;