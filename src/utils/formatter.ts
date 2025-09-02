import type { Module, ModuleCondensed, Lesson, VenueLesson } from '@/types/nusmods.js';
import { DAY_ORDER, DEFAULT_PREVIEW_LIMIT } from '@/config/constants.js';

export function formatPrereqTree(tree: any, indent: number = 0): string {
  const spaces = '  '.repeat(indent);
  
  if (typeof tree === 'string') {
    return `${spaces}• ${tree}`;
  }
  
  if (tree.and) {
    let result = `${spaces}All of:\n`;
    tree.and.forEach((item: any) => {
      result += formatPrereqTree(item, indent + 1) + '\n';
    });
    return result.trim();
  }
  
  if (tree.or) {
    let result = `${spaces}One of:\n`;
    tree.or.forEach((item: any) => {
      result += formatPrereqTree(item, indent + 1) + '\n';
    });
    return result.trim();
  }
  
  return '';
}

export function formatModuleList(modules: ModuleCondensed[], limit?: number): string {
  const displayModules = limit ? modules.slice(0, limit) : modules;
  
  return displayModules.map((mod) => 
    `• ${mod.moduleCode}: ${mod.title} (Semesters: ${mod.semesters.join(', ')})`
  ).join('\n');
}

export function formatTimetable(lessons: Lesson[]): string {
  const lessonsByType: { [key: string]: Lesson[] } = {};
  
  lessons.forEach(lesson => {
    if (!lessonsByType[lesson.lessonType]) {
      lessonsByType[lesson.lessonType] = [];
    }
    lessonsByType[lesson.lessonType].push(lesson);
  });

  let result = '';
  for (const [type, typeLessons] of Object.entries(lessonsByType)) {
    result += `**${type}:**\n`;
    typeLessons.forEach(lesson => {
      result += `  • Class ${lesson.classNo}: ${lesson.day} ${lesson.startTime}-${lesson.endTime} @ ${lesson.venue}\n`;
      if (typeof lesson.weeks === 'object' && 'start' in lesson.weeks) {
        result += `    (${lesson.weeks.start} to ${lesson.weeks.end})\n`;
      }
    });
    result += '\n';
  }
  
  return result;
}

export function formatVenueSchedule(lessons: VenueLesson[]): string {
  const byDay: { [day: string]: VenueLesson[] } = {};
  
  lessons.forEach(lesson => {
    if (!byDay[lesson.day]) byDay[lesson.day] = [];
    byDay[lesson.day].push(lesson);
  });

  let result = '';
  DAY_ORDER.forEach(day => {
    if (byDay[day]) {
      result += `**${day}:**\n`;
      byDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
      byDay[day].forEach(lesson => {
        result += `  • ${lesson.startTime}-${lesson.endTime}: ${lesson.moduleCode} (${lesson.lessonType} ${lesson.classNo})\n`;
      });
      result += '\n';
    }
  });

  return result;
}

export function formatVenueList(venues: string[]): string {
  const grouped: { [prefix: string]: string[] } = {};
  
  venues.forEach(venue => {
    const prefix = venue.split('-')[0] || 'Other';
    if (!grouped[prefix]) grouped[prefix] = [];
    grouped[prefix].push(venue);
  });

  let result = `Total venues: ${venues.length}\n\n`;

  for (const [prefix, venueList] of Object.entries(grouped)) {
    result += `**${prefix}:** ${venueList.length} venues\n`;
    if (venueList.length <= 5) {
      venueList.forEach(v => result += `  • ${v}\n`);
    } else {
      venueList.slice(0, 5).forEach(v => result += `  • ${v}\n`);
      result += `  ... and ${venueList.length - 5} more\n`;
    }
    result += '\n';
  }

  return result;
}

export function formatModulesByDepartment(modules: Module[]): string {
  if (modules.length === 0) {
    return 'No modules found';
  }

  const grouped: { [dept: string]: Module[] } = {};
  modules.forEach(mod => {
    const dept = mod.department || 'Unknown';
    if (!grouped[dept]) grouped[dept] = [];
    grouped[dept].push(mod);
  });

  let result = '';
  for (const [dept, mods] of Object.entries(grouped)) {
    result += `**${dept}:** ${mods.length} modules\n`;
    mods.slice(0, DEFAULT_PREVIEW_LIMIT).forEach(mod => {
      result += `  • ${mod.moduleCode}: ${mod.title}\n`;
    });
    if (mods.length > DEFAULT_PREVIEW_LIMIT) {
      result += `  ... and ${mods.length - DEFAULT_PREVIEW_LIMIT} more\n`;
    }
    result += '\n';
  }

  return result;
}

export function formatWorkload(workload: number[] | string | undefined, moduleCredit: string): string {
  if (Array.isArray(workload)) {
    const [lecture, tutorial, lab, project, prep] = workload;
    return `**Breakdown (hours/week):**\n` +
           `  • Lectures: ${lecture}\n` +
           `  • Tutorials: ${tutorial}\n` +
           `  • Laboratory: ${lab}\n` +
           `  • Project/Fieldwork: ${project}\n` +
           `  • Preparation: ${prep}\n` +
           `  • **Total:** ${lecture + tutorial + lab + project + prep} hours/week`;
  } else if (typeof workload === 'string') {
    return `**Workload description:** ${workload}`;
  } else {
    return `**Expected hours/week:** ${parseFloat(moduleCredit) * 2.5} hours\n\n` +
           'Detailed workload information not available in standard format.';
  }
}

export function extractModuleCodes(text: string): string[] {
  return text.match(/[A-Z]{2,3}\d{4}[A-Z]?/g) || [];
}