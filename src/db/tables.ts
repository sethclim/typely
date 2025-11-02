import { DB } from "./index";

type InsertUsers = {
    id: number;
    name: string;
};

// Example helper functions for a users table
export const ResumeTable = {
    insert: ({ id, name }: InsertUsers) => {
        DB.runAndSave("INSERT INTO resume (id, name) VALUES (?, ?)", [
            id,
            name,
        ]);
    },
    findAll: () => {
        return DB.exec("SELECT * FROM resume");
    },
    // deleteById: (id) => {
    //     DB.runAndSave("DELETE FROM users WHERE id = ?", [id]);
    // },
};
