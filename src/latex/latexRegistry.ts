import engineeringTheme from "./themes/engineering/config.tex?raw";
import headerTemplate from "./themes/engineering/templates/header.tex?raw";
import experienceTemplate from "./themes/engineering/templates/experience.tex?raw";
import projectTemplate from "./themes/engineering/templates/project.tex?raw";
import educationTemplate from "./themes/engineering/templates/education.tex?raw";
import sectionTemplate from "./themes/engineering/templates/section.tex?raw";

export const latexThemes = {
    engineering: {
        config: engineeringTheme,
        templates: {
            header: headerTemplate,
            experience: experienceTemplate,
            project: projectTemplate,
            education: educationTemplate,
            section: sectionTemplate,
        },
    },
    sales: {
        config: "",
        templates: {},
    },
    design: {
        config: "",
        templates: {},
    },
};
