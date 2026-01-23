import React, { useEffect, useState } from "react";
import { DBService } from "../../db/DBService";
import { createRepositories, DataContext, Repositories } from "./DataContext";
// import { DB } from "../../db";
import { TemplateRow } from "../../db/types";
import { Template, Theme } from "../../types";
import { InsertAllTemplates } from "../../helpers/InsertAllTemplates";
// import { ResumeConfig, Theme } from "../../types";

type DataProviderProps = {
    storageKey: string;
    children: React.ReactNode;
};

const hydrateThemes = (rows : Array<any>) : Array<Theme> => {
    if (!rows || rows.length === 0) return [];

    const res = rows.map(themeRow => {
        

        const templates = JSON.parse(themeRow.templates) as TemplateRow[]
        // console.log(JSON.stringify(templates))

        const t : Theme = {
            id: themeRow.id!,
            name: themeRow.name!,
            description: themeRow.description!,
            sty_source: themeRow.sty_source,
            is_system: themeRow.is_system,
            owner_user_id: themeRow.owner_user_id,
            created_at: themeRow.created_at,
            templates: templates.map(templateRow => {
                const template : Template = {
                    id: templateRow.id!,
                    name: templateRow.name,
                    sectionType: templateRow.section_type,
                    content: templateRow.content
                }
                return template
            })
        } 

        return t
    })

  return res
}

export const DataProvider: React.FC<DataProviderProps> = ({ storageKey, children }) => {
    const dbService = React.useMemo(() => new DBService(storageKey), [storageKey]);
    const [repositories, setRepositories] = useState<Repositories | null>(null);

    const [themes, setThemes] = useState<Theme[]>([]);

    React.useEffect(() => {
        dbService.init().then(() => {
            setRepositories(createRepositories(dbService));
        })
        // return () => db.dispose();
    }, [dbService]);

    useEffect(() => {
        if(!repositories) return
            const res = repositories.theme.getAll();
            if (res.length <= 0) InsertAllTemplates(repositories);
    },[repositories])


        const fetchThemes = async () => {
            if(!repositories) return
            // await DB.tablesReady;
            //TODO
            const rows = repositories.theme.getAll();
            const themes = hydrateThemes(rows)
            // console.log("!THEMES " + JSON.stringify(themes))
            if(themes.length > 0)
                setThemes(themes)
        };
    
        useEffect(() => {
            fetchThemes();
            const unsubscribe1 = repositories?.theme.subscribe(fetchThemes);
            const unsubscribe2 = repositories?.template.subscribe(fetchThemes);
            return () => {
                unsubscribe1; 
                unsubscribe2;
            };
        }, [repositories]);


    if (!repositories) return null;

    return (
        <DataContext.Provider value={{ repositories, themes, dbService }}>
        {children}
        </DataContext.Provider>
    );
};