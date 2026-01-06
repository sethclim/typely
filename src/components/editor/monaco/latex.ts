export const myLang = {
    defaultToken: "",
    tokenizer: {
        root: [
            [/%.*$/, "comment"],
            [/\\[a-zA-Z@]+/, "keyword.command"], // all \commands
            [/\$[^$]*\$/, "string.math"], // $x^2$
            [/[{}]/, "delimiter.brace"], // braces
            [/\[\[[A-Za-z0-9_]+\]\]/, "placeholder"],
        ],
    },
};
