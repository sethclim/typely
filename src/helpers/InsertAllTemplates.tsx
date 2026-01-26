import { Repositories } from "../context/data/DataContext"
import { latexThemes } from "../latex/latexRegistry"

export const InsertAllTemplates = async(data: Repositories) =>{
    for (const [name, theme] of Object.entries(latexThemes)) {
        const theme_id = await data.theme.insert({
            name : name,
            description : "",
            sty_source : theme.config,
            is_system: true,
            created_at: ""
        })

        for (const [name, template] of Object.entries(theme.templates)) {
           await data.template.insert({
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
