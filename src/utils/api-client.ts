import fetch from 'node-fetch';
import type { 
  ModuleCondensed, 
  Module, 
  VenueInformation 
} from '@/types/nusmods.js';
import { API_BASE_URL, CURRENT_ACAD_YEAR } from '@/config/constants.js';

export class NUSModsApiClient {
  private readonly baseUrl: string;
  private readonly currentAcadYear: string;

  constructor(acadYear?: string) {
    this.baseUrl = API_BASE_URL;
    this.currentAcadYear = acadYear || CURRENT_ACAD_YEAR;
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json() as T;
  }

  async getModuleList(acadYear?: string): Promise<ModuleCondensed[]> {
    const year = acadYear || this.currentAcadYear;
    const url = `${this.baseUrl}/${year}/moduleList.json`;
    return this.fetchJson<ModuleCondensed[]>(url);
  }

  async getModuleInfo(moduleCode: string, acadYear?: string): Promise<Module> {
    const year = acadYear || this.currentAcadYear;
    const url = `${this.baseUrl}/${year}/modules/${moduleCode}.json`;
    return this.fetchJson<Module>(url);
  }

  async getModuleInformation(acadYear?: string): Promise<Module[]> {
    const year = acadYear || this.currentAcadYear;
    const url = `${this.baseUrl}/${year}/moduleInformation.json`;
    return this.fetchJson<Module[]>(url);
  }

  async getVenueInformation(semester: number, acadYear?: string): Promise<VenueInformation> {
    const year = acadYear || this.currentAcadYear;
    const url = `${this.baseUrl}/${year}/semesters/${semester}/venueInformation.json`;
    return this.fetchJson<VenueInformation>(url);
  }

  async getVenueList(semester: number, acadYear?: string): Promise<string[]> {
    const year = acadYear || this.currentAcadYear;
    const url = `${this.baseUrl}/${year}/semesters/${semester}/venues.json`;
    return this.fetchJson<string[]>(url);
  }

  async searchModules(query: string, modules?: ModuleCondensed[]): Promise<ModuleCondensed[]> {
    const moduleList = modules || await this.getModuleList();
    const searchTerm = query.toLowerCase();
    
    return moduleList.filter(module => 
      module.moduleCode.toLowerCase().includes(searchTerm) ||
      module.title.toLowerCase().includes(searchTerm) ||
      (module.department && module.department.toLowerCase().includes(searchTerm)) ||
      (module.faculty && module.faculty.toLowerCase().includes(searchTerm))
    );
  }

  async getModulesByDepartment(department: string, semester?: number, acadYear?: string): Promise<Module[]> {
    const modules = await this.getModuleInformation(acadYear);
    let filteredModules = modules.filter(module => 
      module.department && module.department.toLowerCase().includes(department.toLowerCase())
    );

    if (semester !== undefined) {
      filteredModules = filteredModules.filter(module => 
        module.semesterData.some(s => s.semester === semester)
      );
    }

    return filteredModules;
  }

  getCurrentAcadYear(): string {
    return this.currentAcadYear;
  }
}