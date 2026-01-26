import fakeData from "../../tests/fake_resume_data.json";
import { IntakeInfo, Personal } from "../components/ResumeIntakeForm/types";
import { Theme } from "../types";

export const loadDemoFromJSON = (themes : Theme[]) => {
    const personal: Personal = {
        fname: fakeData.personal.fname,
        lname: fakeData.personal.lname,
        email: fakeData.personal.email,
        phone: fakeData.personal.phone,
        location: fakeData.personal.location,
        website: fakeData.personal.website,
        github: fakeData.personal.github,
    };

    const info: IntakeInfo = {
        personal,
        skills: fakeData.skills,
        jobs: fakeData.experience,
        projects: fakeData.projects,
        education: fakeData.education,
        theme: themes[0], // pick default theme
    };

    return info;
};