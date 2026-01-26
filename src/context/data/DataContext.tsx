import React, { createContext } from "react";
import { 
    ResumeConfigTable, 
    ResumeDataItemTable, 
    ResumeDataItemTypeTable, 
    ResumeSectionConfigTable, 
    ResumeSectionDataTable, 
    TemplateTable, 
    ThemeTable } from "../../db/tables";
import { DBService } from "../../db/DBService";
import { Theme } from "../../types";

export type Repositories = {
    resumeConfig : ResumeConfigTable
    themes : ThemeTable
    resumeSectionConfig: ResumeSectionConfigTable
    resumeSectionData: ResumeSectionDataTable
    resumeDataItem :  ResumeDataItemTable
    resumeDataItemType : ResumeDataItemTypeTable
    template : TemplateTable,
    theme : ThemeTable
}

export type DataContextData = {
    repositories: Repositories
    themes: Theme[],
    dbService : DBService
}

export function createRepositories(svc:  DBService): Repositories {
    return {
        resumeConfig: new ResumeConfigTable(svc),
        themes: new ThemeTable(svc),
        resumeSectionConfig : new ResumeSectionConfigTable(svc),
        resumeSectionData: new ResumeSectionDataTable(svc),
        resumeDataItem: new ResumeDataItemTable(svc),
        resumeDataItemType: new ResumeDataItemTypeTable(svc),
        template : new TemplateTable(svc),
        theme : new ThemeTable(svc)
    };
}

export const DataContext = createContext<DataContextData | null>(null);

export function useDataContext() {
  const ctx = React.useContext(DataContext);
  if (!ctx) throw new Error("useDataContext must be inside DataProvider");
  return ctx;
}