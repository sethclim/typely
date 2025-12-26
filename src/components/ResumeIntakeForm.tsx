import { MouseEventHandler, ReactNode, useState } from "react";
import { CreateDemoResume } from "../helpers/CreateDemoResume";
import { useRouter } from "@tanstack/react-router";

type Job = {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
};

type SkillPoint = {
    title: string
    skills: string
}

type Education = {
  school: string;
  program: string;
  startDate: string;
  endDate: string;
};

type Personal = {
    name: string,
    email: string,
    phone?: string,
    location?: string,
    summary?: string,
    website?: string,
    github?: string,
}

type Project = {
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

export default function ResumeFormPage() {
    const router = useRouter()
    
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [phone, setPhone] = useState<string>();
    const [location, setLocation] = useState<string>();
    const [summary, setSummary] = useState<string>();
    const [website, setWebsite] = useState<string>();
    const [github, setGithub] = useState<string>();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [skillPoints, setSkillPoints] = useState<SkillPoint[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [education, setEducation] = useState<Education[]>([]);

    const addJob = () =>
        setJobs([...jobs, { company: "", title: "", startDate: "", endDate: "", description: "" }]);

    const addSkill = () =>
        setSkillPoints([...skillPoints, { title: "", skills: ""}]);

    const addProject = () =>
        setProjects([...projects, { title: "", pointOne: "", pointTwo : "", pointThree: "", pointFour : ""}]);

    const addEducation = () =>
        setEducation([...education, { school: "", program: "", startDate: "", endDate: "" }]);

    const Create = () => {

        if(!name || !email)
            return

        const p : Personal = {
            name,
            email,
            phone,
            location,
            summary,
            website,
            github
        }
        const info : IntakeInfo = {
            personal : p,
            skills : skillPoints,
            jobs,
            projects,
            education
        }

        CreateDemoResume(info)

        router.navigate({
            to: '/app',
        })
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-purple-950 text-white p-10">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* PERSONAL INFO */}
                <Section title="Personal Information">
                    <Input label="Full Name" value={name} onChange={(v : string) => setName(v)} />
                    <Input label="Email" value={email} onChange={(v : string)  => setEmail(v)} />
                    <Input label="Phone (Optional)" value={phone} onChange={(v : string)  => setPhone(v)} />
                    <Input label="Location (Optional)" value={location} onChange={(v : string)  => setLocation(v)} />
                    <Input label="Website (Optional)" value={website} onChange={(v : string)  => setWebsite(v)} />
                    <Input label="Github (Optional)" value={github} onChange={(v : string)  => setGithub(v)} />
                    <Textarea label="Professional Summary (Optional)" value={summary} onChange={(v : string)  => setSummary(v)} />
                </Section>

                {/* SKILLS */}
                <Section title="Skills">
                    {skillPoints.map((skill, i) => (
                        <Card key={i}>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <Input
                                        label="Title"
                                        value={skill.title}
                                        onChange={(v: string) =>
                                            setSkillPoints(s => s.map((x, idx) =>
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
                                            setSkillPoints(j => j.map((x, idx) =>
                                            idx === i ? { ...x, skills: v } : x
                                            ))
                                        }
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}

                    <AddButton onClick={addSkill}>+ Skills</AddButton>
                </Section>

                {/* JOB EXPERIENCE */}
                <Section title="Experience">
                    {jobs.map((job, i) => (
                        <Card key={i}>
                        <Input label="Company" value={job.company}
                            onChange={(v : string) => setJobs(j => j.map((x, idx) => idx === i ? { ...x, company: v } : x))} />
                        <Input label="Title" value={job.title}
                            onChange={(v : string) => setJobs(j => j.map((x, idx) => idx === i ? { ...x, title: v } : x))} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Start Date" value={job.startDate}
                            onChange={(v : string) => setJobs(j => j.map((x, idx) => idx === i ? { ...x, startDate: v } : x))} />
                            <Input label="End Date" value={job.endDate}
                            onChange={(v : string) => setJobs(j => j.map((x, idx) => idx === i ? { ...x, endDate: v } : x))} />
                        </div>
                        <Textarea label="Description" value={job.description}
                            onChange={(v : string) => setJobs(j => j.map((x, idx) => idx === i ? { ...x, description: v } : x))} />
                        </Card>
                    ))}

                    <AddButton onClick={addJob}>+ Add Job</AddButton>
                </Section>

                {/*  Projects */}
                <Section title="Projects">
                    {projects.map((project, i) => (
                        <Card key={i}>
                            <Input label="Title" value={project.title}
                                onChange={(v : string) => setProjects(p => p.map((x, idx) => idx === i ? { ...x, title: v } : x))} />
                            <Input label="Point One" value={project.pointOne}
                                onChange={(v : string) => setProjects(p => p.map((x, idx) => idx === i ? { ...x, pointOne: v } : x))} />
                            <Input label="Point Two" value={project.pointTwo}
                                onChange={(v : string) => setProjects(p => p.map((x, idx) => idx === i ? { ...x, pointTwo: v } : x))} />
                             <Input label="Point Three" value={project.pointThree}
                                onChange={(v : string) => setProjects(p => p.map((x, idx) => idx === i ? { ...x, pointThree: v } : x))} />
                            <Input label="Point Four" value={project.pointFour}
                                onChange={(v : string) => setProjects(p => p.map((x, idx) => idx === i ? { ...x, pointFour: v } : x))} />
                        </Card>
                    ))}

                    <AddButton onClick={addProject}>+ Add Project</AddButton>
                </Section>

                {/* EDUCATION */}
                <Section title="Education">
                    {education.map((ed, i) => (
                        <Card key={i}>
                        <Input label="School" value={ed.school}
                            onChange={(v : string) => setEducation(e => e.map((x, idx) => idx === i ? { ...x, school: v } : x))} />
                        <Input label="Program / Degree" value={ed.program}
                            onChange={(v : string) => setEducation(e => e.map((x, idx) => idx === i ? { ...x, program: v } : x))} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Start Date" value={ed.startDate}
                            onChange={(v : string) => setEducation(e => e.map((x, idx) => idx === i ? { ...x, startDate: v } : x))} />
                            <Input label="End Date" value={ed.endDate}
                            onChange={(v : string) => setEducation(e => e.map((x, idx) => idx === i ? { ...x, endDate: v } : x))} />
                        </div>
                        </Card>
                    ))}
                    <AddButton onClick={addEducation}>+ Add Education</AddButton>
                </Section>
                <button onClick={() => Create()}>CREATE</button>
            </div>
        </div>
    );
}

type SectionProps = {
    title : string
    children : ReactNode
}
const Section = ({ title, children }: SectionProps) => (
  <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 space-y-4 shadow-xl">
    <h2 className="text-xl font-semibold">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

type CardProps = {
    children : ReactNode
}
const Card = ({ children }: CardProps) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
    {children}
  </div>
);

type InputProps = {
    label : string 
    value : string | undefined
    onChange : (v : string) => void
}

const Input = ({ label, value, onChange }: InputProps) => (
  <div className="flex flex-col items-center">
    <label className="text-sm text-white/70">{label}</label>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full mt-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

const Textarea = ({ label, value, onChange }: InputProps) => (
  <div>
    <label className="text-sm text-white/70">{label}</label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={4}
      className="w-full mt-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

type AddButtonProps = {
    onClick : MouseEventHandler<HTMLButtonElement> | undefined
    children : ReactNode
}

const AddButton = ({ children, onClick }: AddButtonProps) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-lg bg-purple-600/80 hover:bg-purple-600 transition"
  >
    {children}
  </button>
);
