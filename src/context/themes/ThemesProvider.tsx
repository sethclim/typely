// import React, { useEffect, useState } from "react";
// import { ThemesContext } from "./ThemesContext";
// import { TemplateTable, ThemeTable } from "../../db/tables";
// import { DB } from "../../db";
// import { Template, Theme } from "../../types";
// import { TemplateRow } from "../../db/types";
// // import { TemplateRow } from "../../db/types";


// type ThemesProviderProps = {
//   children: React.ReactNode;
// };

// //TODO ThemeThemeDataRowWithTemplates
// const hydrateThemes = (rows : Array<any>) : Array<Theme> => {
//     if (!rows || rows.length === 0) return [];

//     const res = rows.map(themeRow => {
        

//         const templates = JSON.parse(themeRow.templates) as TemplateRow[]
//         // console.log(JSON.stringify(templates))

//         const t : Theme = {
//             id: themeRow.id!,
//             name: themeRow.name!,
//             description: themeRow.description!,
//             sty_source: themeRow.sty_source,
//             is_system: themeRow.is_system,
//             owner_user_id: themeRow.owner_user_id,
//             created_at: themeRow.created_at,
//             templates: templates.map(templateRow => {
//                 const template : Template = {
//                     id: templateRow.id!,
//                     name: templateRow.name,
//                     sectionType: templateRow.section_type,
//                     content: templateRow.content
//                 }
//                 return template
//             })
//         } 

//         return t
//     })

//   return res
// }

// export const ThemesProvider: React.FC<ThemesProviderProps> = ({ children }) => {
//     const [themes, setThemes] = useState<Theme[]>([]);


//     const fetchThemes = async () => {
//         await DB.tablesReady;
//         //TODO
//         const rows = ThemeTable.getAll();
//         const themes = hydrateThemes(rows)
//         // console.log("!THEMES " + JSON.stringify(themes))
//         if(themes.length > 0)
//             setThemes(themes)
//     };

//     useEffect(() => {
//         fetchThemes();
//         const unsubscribe1 = ThemeTable.subscribe(fetchThemes);
//         const unsubscribe2 = TemplateTable.subscribe(fetchThemes);
//         return () => {
//             unsubscribe1; 
//             unsubscribe2;
//         };
//     }, [DB.tablesReady]);

//     return (
//         <ThemesContext.Provider value={{ themes, refresh: fetchThemes }}>
//         {children}
//         </ThemesContext.Provider>
//     );
// };