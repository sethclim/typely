export type Job = {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  pointOne: string;
  pointTwo: string;
  pointThree: string;
  pointFour: string;
};

export type SkillPoint = {
    title: string
    skills: string
}

export type Education = {
  school: string;
  program: string;
  startDate: string;
  endDate: string;
};

export type Personal = {
    name: string,
    email: string,
    phone?: string,
    location?: string,
    summary?: string,
    website?: string,
    github?: string,
}

export type Project = {
    title: string
    pointOne: string
    pointTwo: string
    pointThree: string
    pointFour: string
}

export type IntakeInfo = {
    personal : Personal
    skills: Array<SkillPoint>
    jobs : Array<Job>
    projects: Array<Project>
    education : Array<Education>
}