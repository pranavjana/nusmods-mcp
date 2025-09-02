export interface ModuleCondensed {
  moduleCode: string;
  title: string;
  semesters: number[];
  moduleCredit: string;
  department?: string;
  faculty?: string;
}

export interface Module {
  moduleCode: string;
  title: string;
  description?: string;
  moduleCredit: string;
  department?: string;
  faculty?: string;
  workload?: number[] | string;
  prerequisite?: string;
  corequisite?: string;
  preclusion?: string;
  semesterData: SemesterData[];
  prereqTree?: any;
  fulfillRequirements?: string[];
  attributes?: {
    mpes1?: boolean;
    mpes2?: boolean;
    ues?: boolean;
    ssgf?: boolean;
    lab?: boolean;
    grsu?: boolean;
    nus?: boolean;
    fyp?: boolean;
    iss?: boolean;
    [key: string]: boolean | undefined;
  };
}

export interface SemesterData {
  semester: number;
  timetable: Lesson[];
  examDate?: string;
  examDuration?: number;
  covidZones?: string[];
}

export interface Lesson {
  classNo: string;
  lessonType: string;
  weeks: number[] | WeekRange;
  day: string;
  startTime: string;
  endTime: string;
  venue: string;
  size?: number;
}

export interface WeekRange {
  start: string;
  end: string;
  weekInterval?: number;
  weeks?: number[];
}

export interface VenueLesson {
  classNo: string;
  lessonType: string;
  weeks: number[] | WeekRange;
  day: string;
  startTime: string;
  endTime: string;
  moduleCode: string;
  title: string;
  size: number;
}

export interface VenueInformation {
  [venue: string]: {
    classes: VenueLesson[];
    availabilities: any;
  };
}

export interface PrerequisiteTree {
  and?: PrerequisiteTree[];
  or?: PrerequisiteTree[];
  nOf?: [number, PrerequisiteTree[]];
  moduleCode?: string;
}

export interface AcademicYear {
  acadYear: string;
  startDate: string;
  endDate: string;
  semester1: Semester;
  semester2: Semester;
  specialTerm1?: Semester;
  specialTerm2?: Semester;
}

export interface Semester {
  start: string;
  end: string;
  weeks: number;
  orientation?: string;
  recess?: string;
  reading?: string;
  examination?: string;
  publicHolidays?: string[];
}

export interface ModuleSearchOptions {
  query?: string;
  department?: string;
  faculty?: string;
  semester?: number;
  limit?: number;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}