import { NUSModsApiClient } from '@/utils/api-client.js';
import { 
  formatModuleList, 
  formatTimetable, 
  formatPrereqTree, 
  formatVenueSchedule, 
  formatVenueList, 
  formatModulesByDepartment, 
  formatWorkload, 
  extractModuleCodes 
} from '@/utils/formatter.js';
import { CURRENT_ACAD_YEAR, DEFAULT_SEARCH_LIMIT } from '@/config/constants.js';

export class ToolHandlers {
  private apiClient: NUSModsApiClient;

  constructor(apiClient: NUSModsApiClient) {
    this.apiClient = apiClient;
  }

  async searchModules(query: string, acadYear: string = CURRENT_ACAD_YEAR) {
    const modules = await this.apiClient.searchModules(query);
    const results = modules.slice(0, DEFAULT_SEARCH_LIMIT);

    const formattedResults = formatModuleList(results);

    return {
      content: [
        {
          type: 'text',
          text: results.length > 0 
            ? `Found ${results.length} modules matching "${query}":\n\n${formattedResults}`
            : `No modules found matching "${query}"`,
        },
      ],
    };
  }

  async getModuleInfo(moduleCode: string, acadYear: string = CURRENT_ACAD_YEAR) {
    const module = await this.apiClient.getModuleInfo(moduleCode, acadYear);

    let info = `**${module.moduleCode}: ${module.title}**\n\n`;
    info += `**Credits:** ${module.moduleCredit} MCs\n`;
    if (module.department) info += `**Department:** ${module.department}\n`;
    if (module.faculty) info += `**Faculty:** ${module.faculty}\n`;
    info += `\n**Description:**\n${module.description || 'No description available'}\n`;

    if (module.prerequisite) {
      info += `\n**Prerequisites:** ${module.prerequisite}\n`;
    }
    if (module.corequisite) {
      info += `**Corequisites:** ${module.corequisite}\n`;
    }
    if (module.preclusion) {
      info += `**Preclusions:** ${module.preclusion}\n`;
    }

    const semesters = module.semesterData.map(s => s.semester).join(', ');
    info += `\n**Offered in Semesters:** ${semesters}`;

    return {
      content: [
        {
          type: 'text',
          text: info,
        },
      ],
    };
  }

  async getModuleTimetable(moduleCode: string, acadYear: string = CURRENT_ACAD_YEAR, semester: number) {
    const module = await this.apiClient.getModuleInfo(moduleCode, acadYear);
    const semesterData = module.semesterData.find(s => s.semester === semester);

    if (!semesterData) {
      return {
        content: [
          {
            type: 'text',
            text: `Module ${moduleCode} is not offered in Semester ${semester}`,
          },
        ],
      };
    }

    let timetableInfo = `**${moduleCode} - Semester ${semester} Timetable**\n\n`;
    timetableInfo += formatTimetable(semesterData.timetable);

    if (semesterData.examDate) {
      timetableInfo += `**Exam:** ${semesterData.examDate} (${semesterData.examDuration || 0} minutes)`;
    }

    return {
      content: [
        {
          type: 'text',
          text: timetableInfo,
        },
      ],
    };
  }

  async getModulePrerequisites(moduleCode: string, acadYear: string = CURRENT_ACAD_YEAR) {
    const module = await this.apiClient.getModuleInfo(moduleCode, acadYear);

    let prereqInfo = `**Prerequisites for ${moduleCode}:**\n\n`;

    if (module.prerequisite) {
      prereqInfo += `**Text Description:** ${module.prerequisite}\n\n`;
    }

    if (module.prereqTree) {
      prereqInfo += `**Prerequisite Tree:**\n${formatPrereqTree(module.prereqTree, 0)}\n\n`;
    }

    if (module.fulfillRequirements && module.fulfillRequirements.length > 0) {
      prereqInfo += `**This module fulfills prerequisites for:**\n`;
      module.fulfillRequirements.forEach(code => {
        prereqInfo += `  • ${code}\n`;
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: prereqInfo || 'No prerequisite information available',
        },
      ],
    };
  }

  async listModulesByDepartment(department: string, acadYear: string = CURRENT_ACAD_YEAR) {
    const deptModules = await this.apiClient.getModulesByDepartment(department, undefined, acadYear);

    if (deptModules.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No modules found for department "${department}"`,
          },
        ],
      };
    }

    const result = `**Modules by Department (matching "${department}"):**\n\n` +
                   formatModulesByDepartment(deptModules);

    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  }

  async getVenueSchedule(venue: string, acadYear: string = CURRENT_ACAD_YEAR, semester: number) {
    const venueInfo = await this.apiClient.getVenueInformation(semester, acadYear);
    const venueData = venueInfo[venue];

    if (!venueData) {
      return {
        content: [
          {
            type: 'text',
            text: `No schedule found for venue "${venue}" in Semester ${semester}`,
          },
        ],
      };
    }

    const schedule = `**Schedule for ${venue} - Semester ${semester}:**\n\n` +
                    formatVenueSchedule(venueData.classes);

    return {
      content: [
        {
          type: 'text',
          text: schedule,
        },
      ],
    };
  }

  async listAllVenues(acadYear: string = CURRENT_ACAD_YEAR, semester: number) {
    const venues = await this.apiClient.getVenueList(semester, acadYear);

    const result = `**Venues in Semester ${semester}:**\n\n` +
                   formatVenueList(venues);

    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  }

  async checkModuleAvailability(moduleCode: string, acadYear: string = CURRENT_ACAD_YEAR, semester: number) {
    const module = await this.apiClient.getModuleInfo(moduleCode, acadYear);
    const isOffered = module.semesterData.some(s => s.semester === semester);

    let result = `**${moduleCode} in Semester ${semester}:**\n\n`;
    result += isOffered ? '✅ Module is offered\n\n' : '❌ Module is NOT offered\n\n';

    result += `**Available semesters:** ${module.semesterData.map(s => s.semester).join(', ')}\n`;

    if (isOffered) {
      const semData = module.semesterData.find(s => s.semester === semester);
      if (semData) {
        const lessonTypes = [...new Set(semData.timetable.map(l => l.lessonType))];
        result += `**Class types:** ${lessonTypes.join(', ')}\n`;
        if (semData.examDate) {
          result += `**Has final exam:** Yes (${semData.examDate})`;
        } else {
          result += `**Has final exam:** No`;
        }
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  }

  async getModuleWorkload(moduleCode: string, acadYear: string = CURRENT_ACAD_YEAR) {
    const module = await this.apiClient.getModuleInfo(moduleCode, acadYear);

    let workloadInfo = `**Workload for ${moduleCode}:**\n\n`;
    workloadInfo += `**Module Credits:** ${module.moduleCredit} MCs\n`;
    workloadInfo += `**Expected hours/week:** ${parseFloat(module.moduleCredit) * 2.5} hours\n\n`;

    workloadInfo += formatWorkload(module.workload, module.moduleCredit);

    return {
      content: [
        {
          type: 'text',
          text: workloadInfo,
        },
      ],
    };
  }

  async findConflictingModules(moduleCode: string, acadYear: string = CURRENT_ACAD_YEAR) {
    const module = await this.apiClient.getModuleInfo(moduleCode, acadYear);

    let conflictInfo = `**Conflicts and Restrictions for ${moduleCode}:**\n\n`;

    if (module.preclusion) {
      conflictInfo += `**Preclusions (cannot take together):**\n${module.preclusion}\n\n`;
      
      const preclusionCodes = extractModuleCodes(module.preclusion);
      if (preclusionCodes.length > 0) {
        conflictInfo += `**Detected preclusion codes:**\n`;
        preclusionCodes.forEach(code => {
          conflictInfo += `  • ${code}\n`;
        });
        conflictInfo += '\n';
      }
    }

    if (module.corequisite) {
      conflictInfo += `**Corequisites (must take together):**\n${module.corequisite}\n\n`;
    }

    if (!module.preclusion && !module.corequisite) {
      conflictInfo += 'No preclusions or corequisites found for this module.';
    }

    return {
      content: [
        {
          type: 'text',
          text: conflictInfo,
        },
      ],
    };
  }
}