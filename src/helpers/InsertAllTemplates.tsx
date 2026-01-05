

import { TemplateTable, ThemeTable } from "../db/tables"
import { latexThemes } from "../latex/latexRegistry"



export const InsertAllTemplates = () =>{



    for (const [name, theme] of Object.entries(latexThemes)) {
        // console.log(name)
        const theme_id = ThemeTable.insert({
            name : name,
            description : "",
            sty_source : theme.config,
            is_system: true,
            created_at: ""
        })

        for (const [name, template] of Object.entries(theme.templates)) {
            // console.log(`    ${name}`)
            TemplateTable.insert({
                "name": `${name} template`,
                "description": `this is a ${name} template`,
                "section_type": name,
                "created_at" : Date.now().toString(),
                "content": template,
                theme_id : theme_id
            })
        }

    }



}