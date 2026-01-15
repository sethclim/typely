import theme from "./config.tex?raw";
import header from "./templates/header.tex?raw";
import experience from "./templates/experience.tex?raw";
import project from "./templates/project.tex?raw";
import education from "./templates/education.tex?raw";
import section from "./templates/section.tex?raw";


export const faang = {
    config: theme,
    templates: {
        header: header,
        experience: experience,
        project: project,
        education: education,
        section: section,
    },
}