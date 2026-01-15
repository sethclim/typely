
import { Dispatch, SetStateAction } from "react"
import { Education, Job, Project, SkillPoint } from "./types"
import { AddButton, Card, Section, Input, Textarea } from "./ui"

export type PersonalSectionProps = {
  fname?: string
  onFNameChange: (v: string) => void

  lname?: string
  onLNameChange: (v: string) => void

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
  fname,
  onFNameChange,
  lname,
  onLNameChange,
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
      <Input input_id="fname-input" label="First Name" value={fname} onChange={onFNameChange} />
      <Input input_id="lname-input" label="Last Name" value={lname} onChange={onLNameChange} />
      <Input input_id="email-input" label="Email" value={email} onChange={onEmailChange} />
      <Input input_id="phone-input" label="Phone (Optional)" value={phone} onChange={onPhoneChange} />
      <Input input_id="location-input" label="Location (Optional)" value={location} onChange={onLocationChange} />
      <Input input_id="website-input" label="Website (Optional)" value={website} onChange={onWebsiteChange} />
      <Input input_id="github-input" label="Github (Optional)" value={github} onChange={onGithubChange} />
      <Textarea
        input_id="summary-input"
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
                                input_id={`skills-title-${i}`}
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
                                input_id={`skills-points-${i}`}
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
            <AddButton id="skills-add-btn" onClick={props.addSkill}>+ Skills</AddButton>
        </Section>
    )
}

export type ExperienceProps = {
    jobs:  Job[] 
    setJobs: (value: SetStateAction<Job[]>) => void
    addJob: () => void
    close: (index: number) => void
}

export const ExperienceSection = (props : ExperienceProps) => {
    return(
        <Section title="Experience">
            {props.jobs.map((job, i) => (
                <Card key={i} onClose={() => props.close(i)}>
                    <Input input_id={`exp-company-input-${i}`} label="Company" value={job.company}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, company: v } : x))} />
                    <Input input_id={`exp-title-input-${i}`} label="Title" value={job.title}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, title: v } : x))} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input input_id={`exp-start-date-input-${i}`} label="Start Date" value={job.startDate}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, startDate: v } : x))} />
                        <Input input_id={`exp-end-date-input-${i}`} label="End Date" value={job.endDate}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, endDate: v } : x))} />
                    </div>
                  <Input input_id={`exp-location-input-${i}`} label="Location" value={job.location}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, location: v } : x))} />
                  <Input input_id={`exp-point-one-input-${i}`} label="Point One" value={job.pointOne}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, pointOne: v } : x))} />
                  <Input input_id={`exp-point-two-input-${i}`} label="Point Two" value={job.pointTwo}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, pointTwo: v } : x))} />
                  <Input input_id={`exp-point-three-input-${i}`} label="Point Three" value={job.pointThree}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, pointThree: v } : x))} />
                  <Input input_id={`exp-point-four-input-${i}`} label="Point Four" value={job.pointFour}
                        onChange={(v : string) => props.setJobs(j => j.map((x, idx) => idx === i ? { ...x, pointFour: v } : x))} />
                </Card>
            ))}

            <AddButton id="job-add-btn" onClick={props.addJob}>+ Add Job</AddButton>
        </Section>
    )
}

export type ProjectsProps = {
  projects: Project[]
  setProjects: (value: SetStateAction<Project[]>) => void
  addProject: () => void
  close: (index: number) => void
}

export const ProjectsSection = (props: ProjectsProps) => {

  return (
    <Section title="Projects">
      {props.projects.map((project, i) => (
        <Card key={i} onClose={() => props.close(i)}>
          <Input
            input_id={`proj-title-input-${i}`}
            label="Title"
            value={project.title}
            onChange={(v: string) =>
              props.setProjects(p =>
                p.map((x, idx) => idx === i ? { ...x, title: v } : x)
              )
            }
          />

          <Input
            input_id={`proj-point-one-input-${i}`}
            label="Point One"
            value={project.pointOne}
            onChange={(v: string) =>
              props.setProjects(p =>
                p.map((x, idx) => idx === i ? { ...x, pointOne: v } : x)
              )
            }
          />

          <Input
            input_id={`proj-point-two-input-${i}`}
            label="Point Two"
            value={project.pointTwo}
            onChange={(v: string) =>
              props.setProjects(p =>
                p.map((x, idx) => idx === i ? { ...x, pointTwo: v } : x)
              )
            }
          />

          <Input
            input_id={`proj-point-three-input-${i}`}
            label="Point Three"
            value={project.pointThree}
            onChange={(v: string) =>
              props.setProjects(p =>
                p.map((x, idx) => idx === i ? { ...x, pointThree: v } : x)
              )
            }
          />

          <Input
            input_id={`proj-point-four-input-${i}`}
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

      <AddButton id="project-add-btn" onClick={props.addProject}>+ Add Project</AddButton>
    </Section>
  )
}


export type EducationProps = {
  education: Education[]
  setEducation: (value: SetStateAction<Education[]>) => void
  addEducation: () => void
  close: (index: number) => void
}

export const EducationSection = (props: EducationProps) => {
  return (
    <Section title="Education">
      {props.education.map((ed, i) => (
        <Card key={i} onClose={() => props.close(i)}>
          <Input
            input_id={`edu-school-input-${i}`}
            label="School"
            value={ed.school}
            onChange={(v: string) =>
              props.setEducation(e =>
                e.map((x, idx) => idx === i ? { ...x, school: v } : x)
              )
            }
          />

          <Input
            input_id={`edu-program-input-${i}`}
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
              input_id={`edu-start-date-input-${i}`}
              label="Start Date"
              value={ed.startDate}
              onChange={(v: string) =>
                props.setEducation(e =>
                  e.map((x, idx) => idx === i ? { ...x, startDate: v } : x)
                )
              }
            />

            <Input
              input_id={`edu-end-date-input-${i}`}
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

      <AddButton id="edu-add-btn" onClick={props.addEducation}>+ Add Education</AddButton>
    </Section>
  )
}
