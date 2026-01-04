import engineeringTheme from "./themes/engineering/config.tex?raw";
import headerTemplate from "./themes/engineering/templates/header.tex?raw";
import experienceTemplate from "./themes/engineering/templates/experience.tex?raw";
import projectTemplate from "./themes/engineering/templates/project.tex?raw";
import educationTemplate from "./themes/engineering/templates/education.tex?raw";
import sectionTemplate from "./themes/engineering/templates/section.tex?raw";

import colorTheme from "./themes/colorful/config.tex?raw";
import colorHeaderTemplate from "./themes/colorful/templates/header.tex?raw";
import colorExperienceTemplate from "./themes/colorful/templates/experience.tex?raw";
import colorProjectTemplate from "./themes/colorful/templates/project.tex?raw";
import colorEducationTemplate from "./themes/colorful/templates/education.tex?raw";
import colorSectionTemplate from "./themes/colorful/templates/section.tex?raw";

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
    colorful: {
        config: colorTheme,
        templates: {
            header: colorHeaderTemplate,
            experience: colorExperienceTemplate,
            project: colorProjectTemplate,
            education: colorEducationTemplate,
            section: colorSectionTemplate,
        },
    },
};
