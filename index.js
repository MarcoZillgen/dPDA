// Automat for the language of exercise a)
const q1q1 = [
    new Connection("q1", "q1", new Condition("a", "a", ["a", "a"])),
    new Connection("q1", "q1", new Condition("a", "b", ["a", "b"])),
    new Connection("q1", "q1", new Condition("b", "a", ["b", "a"])),
    new Connection("q1", "q1", new Condition("b", "b", ["b", "b"])),
    new Connection("q1", "q1", new Condition("a", "Z", ["a", "Z"])),
    new Connection("q1", "q1", new Condition("b", "Z", ["b", "Z"])),
];
const q1q2 = [
    new Connection("q1", "q2", new Condition("c", "a", ["a"])),
    new Connection("q1", "q2", new Condition("c", "b", ["b"])),
];
const q2q2 = [
    new Connection("q2", "q2", new Condition("a", "a", [null])),
    new Connection("q2", "q2", new Condition("b", "b", [null])),
];
const q2q3 = new Connection("q2", "q3", new Condition(null, "Z", [null]));
const pda = new PDA([...q1q1, ...q1q2, ...q2q2, q2q3], "q1", "q3");
const testString = ["a", "b", "a", "c", "a", "b", "a"];
pda.view(testString);



mermaid.initialize({ startOnLoad: true });
