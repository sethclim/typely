
import { Dispatch, SetStateAction } from "react"
import { Education, Job, Project, SkillPoint } from "./types"
import { AddButton, Card, Section } from "./ui"
import { Input, Textarea } from "./ui"

export type PersonalSectionProps = {
  name?: string
  onNameChange: (v: string) => void

  email?: string
  onEmailChange: (v: string) => void

  phone?: string
  onPhoneChange: (v: string) => void

  location?: string
  onLocationChange: (v: string) => void

  website?: string
  onWebsiteChange: (v: string) => void

  github?: string
  onGithubChange: (v: string) => void

  summary?: string
  onSummaryChange: (v: string) => void
}

export const PersonalSection = ({
  name,
  onNameChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  location,
  onLocationChange,
  website,
  onWebsiteChange,
  github,
  onGithubChange,
  summary,
  onSummaryChange
}: PersonalSectionProps) => {
  return (
    <Section title="Personal Information">
      <Input label="Full Name" value={name} onChange={onNameChange} />
      <Input label="Email" value={email} onChange={onEmailChange} />
      <Input label="Phone (Optional)" value={phone} onChange={onPhoneChange} />
      <Input label="Location (Optional)" value={location} onChange={onLocationChange} />
      <Input label="Website (Optional)" value={website} onChange={onWebsiteChange} />
      <Input label="Github (Optional)" value={github} onChange={onGithubChange} />
      <Textarea
        label="Professional Summary (Optional)"
        value={summary}
        onChange={onSummaryChange}
      />
    </Section>
  )
}

export type SkillsSectionProps = {
    skillPoints : SkillPoint[]
    setSkillPoints: Dispatch<SetStateAction<SkillPoint[]>>
    addSkill: () => void
}

export const SkillsSection = (props : SkillsSectionProps) => {

    return(
        <Section title="Skills">
            {
            props.skillPoints.map((skill, i) => (
                <Card key={i}>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                            <Input
                                label="Title"
                                value={skill.title}
                                onChange={(v: string) =>
                                    props.setSkillPoints(s => s.map((x, idx) =>
                                    idx === i ? { ...x, title: v } : x
                                    ))
                                }
                            />
                        </div>

                        <div className="col-span-3">
                            <Input
                                label="Skills"
                                value={skill.skills}
                                onChange={(v: string) =>
                                    props.setSkillPoints(j => j.map((x, idx) =>
                                    idx === i ? { ...x, skills: v } : x
                                    ))
                                }
                            />
                        </div>
                    </div>
                </Card>
            ))
            }
            <AddButton onClick={props.addSkill}>+ Skills</AddButton>
        </Section>
    )
}

export type ExperienceProps = {
    jobs:  Job[] 
    setJobs: (value: SetStateAction<Job[]>) => void
    addJob: () => void
}

export const ExperienceSection = (props : ExperienceProps) => {
    return(
        <Section title="Experience">
            {props.jobs.map((job, i) => (
                <Card key={i}>
                    <Input label="Company" value={job.company}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, company: v } : x))} />
                    <Input label="Title" value={job.title}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, title: v } : x))} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Start Date" value={job.startDate}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, startDate: v } : x))} />
                        <Input label="End Date" value={job.endDate}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, endDate: v } : x))} />
                    </div>
                    <Textarea label="Description" value={job.description}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, description: v } : x))} />
                </Card>
            ))}

            <AddButton onClick={props.addJob}>+ Add Job</AddButton>
        </Section>
    )
}


export type ProjectsProps = {
  projects: Project[]
  setProjects: (value: SetStateAction<Project[]>) => void
  addProject: () => void
}

export const ProjectsSection = (props: ProjectsProps) => {
  return (
    <Section title="Projects">
      {props.projects.map((project, i) => (
        <Card key={i}>
          <Input
            label="Title"
            value={project.title}
            onChange={(v: string) =>
              props.setProjects(p =>
                p.map((x, idx) => idx === i ? { ...x, title: v } : x)
              )
            }
          />

          <Input
            label="Point One"
            value={project.pointOne}
            onChange={(v: string) =>
              props.setProjects(p =>
                p.map((x, idx) => idx === i ? { ...x, pointOne: v } : x)
              )
            }
          />

          <Input
            label="Point Two"
            value={project.pointTwo}
            onChange={(v: string) =>
              props.setProjects(p =>
                p.map((x, idx) => idx === i ? { ...x, pointTwo: v } : x)
              )
            }
          />

          <Input
            label="Point Three"
            value={project.pointThree}
            onChange={(v: string) =>
              props.setProjects(p =>
                p.map((x, idx) => idx === i ? { ...x, pointThree: v } : x)
              )
            }
          />

          <Input
            label="Point Four"
            value={project.pointFour}
            onChange={(v: string) =>
              props.setProjects(p =>
                p.map((x, idx) => idx === i ? { ...x, pointFour: v } : x)
              )
            }
          />
        </Card>
      ))}

      <AddButton onClick={props.addProject}>+ Add Project</AddButton>
    </Section>
  )
}


export type EducationProps = {
  education: Education[]
  setEducation: (value: SetStateAction<Education[]>) => void
  addEducation: () => void
}

export const EducationSection = (props: EducationProps) => {
  return (
    <Section title="Education">
      {props.education.map((ed, i) => (
        <Card key={i}>
          <Input
            label="School"
            value={ed.school}
            onChange={(v: string) =>
              props.setEducation(e =>
                e.map((x, idx) => idx === i ? { ...x, school: v } : x)
              )
            }
          />

          <Input
            label="Program / Degree"
            value={ed.program}
            onChange={(v: string) =>
              props.setEducation(e =>
                e.map((x, idx) => idx === i ? { ...x, program: v } : x)
              )
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              value={ed.startDate}
              onChange={(v: string) =>
                props.setEducation(e =>
                  e.map((x, idx) => idx === i ? { ...x, startDate: v } : x)
                )
              }
            />

            <Input
              label="End Date"
              value={ed.endDate}
              onChange={(v: string) =>
                props.setEducation(e =>
                  e.map((x, idx) => idx === i ? { ...x, endDate: v } : x)
                )
              }
            />
          </div>
        </Card>
      ))}

      <AddButton onClick={props.addEducation}>+ Add Education</AddButton>
    </Section>
  )
}
