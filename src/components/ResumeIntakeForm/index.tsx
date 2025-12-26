import { useState } from "react";
import { CreateDemoResume } from "../../helpers/CreateDemoResume";
import { useRouter } from "@tanstack/react-router";

import {Education, IntakeInfo, Job, Personal, Project, SkillPoint } from "./types"
import { EducationSection, ExperienceSection, PersonalSection, ProjectsSection, SkillsSection } from "./sections";

export function ResumeIntakeForm() {
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

    const addJob = () => setJobs([...jobs, { company: "", title: "", startDate: "", endDate: "", description: "" }]);

    const addSkill = () => setSkillPoints([...skillPoints, { title: "", skills: ""}]);

    const addProject = () => setProjects([...projects, { title: "", pointOne: "", pointTwo : "", pointThree: "", pointFour : ""}]);

    const addEducation = () => setEducation([...education, { school: "", program: "", startDate: "", endDate: "" }]);

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
                <PersonalSection 
                    name={name} 
                    onNameChange={setName}
                    email={email}
                    onEmailChange={setEmail}
                    phone={phone}
                    onPhoneChange={setPhone}
                    location={location}
                    onLocationChange={setLocation}
                    website={website}
                    onWebsiteChange={setWebsite}
                    github={github}
                    onGithubChange={setGithub}
                    summary={summary}
                    onSummaryChange={setSummary} />

                <SkillsSection skillPoints={skillPoints} setSkillPoints={setSkillPoints} addSkill={addSkill} />

                <ExperienceSection jobs={jobs} setJobs={setJobs} addJob={addJob} />

                <ProjectsSection projects={projects} setProjects={setProjects} addProject={addProject} />

                <EducationSection education={education} setEducation={setEducation} addEducation={addEducation} />

                <button onClick={() => Create()}>CREATE</button>
            </div>
        </div>
    );
}