export type Question = {
    question: string;
    answer: "pants on fire" | "false" | "mostly false" | "mostly true" | "true";
    why: JSX.Element;
    difficulty: "easy" | "medium" | "hard" | "cursed";
}