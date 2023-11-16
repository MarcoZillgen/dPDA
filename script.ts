
// String used for single character (a, b, c, etc.)
type CellarString = string | null;

// return of runOnce()
type RunOnce = { newCellar: CellarString[]; newState: string } | null;

// Connection between states
class Connection {
  startState: string;
  endState: string;
  finalState: boolean;
  condition: Condition;
  constructor(
    startState: string,
    endState: string,
    conditions: Condition,
    finalState: boolean = false
  ) {
    this.startState = startState;
    this.endState = endState;
    this.condition = conditions;
    this.finalState = finalState;
  }
}

// Condition for a connection
class Condition {
  string: CellarString;
  cellar: CellarString;
  newCellar: CellarString[];
  constructor(
    string: CellarString,
    cellar: CellarString,
    newCellar: CellarString[]
  ) {
    this.string = string;
    this.cellar = cellar;
    this.newCellar = newCellar;
  }
}

// Pushdown automat class
class PDA {
  connections: Connection[];
  startState: string;
  endState: string;
  constructor(connections: Connection[], startState: string, endState: string) {
    this.connections = connections;
    this.startState = startState;
    this.endState = endState;
  }

  // Run the automat completely
  run(testString: CellarString[]) {
    let currentState: string = this.startState;
    let cellar: CellarString[] = ["Z"];

    // Run the automat until the end state is reached
    for (let i = 0; i < testString.length; i++) {
      console.log(cellar);
      console.log(currentState);

      // Find all connections that match the current state, string and cellar
      const currentString = testString[i];
      const currentCellar: CellarString =
        cellar.length > 0 ? cellar.pop()! : null;
      const currentConnections = this.findConnections(
        currentState,
        currentString,
        currentCellar
      );

      // If no connections are found, throw an error
      if (currentConnections.length == 0)
        throw new Error(
          "No connections found for state " +
            currentState +
            " with string " +
            currentString +
            " and cellar " +
            currentCellar +
            " at index " +
            i
        );

      // If multiple connections are found, throw an error
      if (currentConnections.length > 1)
        throw new Error("This is not a deterministic automat");

      // If a connection is found, change the current state and cellar accordingly
      currentState = currentConnections[0].endState;
      cellar = [
        ...cellar,
        ...currentConnections[0].condition.newCellar
          .filter((cellarStr) => cellarStr != null)
          .reverse(),
      ];
    }

    // Check if the end state is reached
    if (JSON.stringify(cellar) == JSON.stringify(["Z"])) return true;
    // If not, throw an error
    else throw new Error("Cellar is not empty at the end of the string");
  }

  // Find all connections that match the current state, string and cellar
  findConnections(
    currentState: string,
    currentString: CellarString,
    currentCellar: CellarString
  ) {
    return this.connections.filter(
      (connection) =>
        connection.startState == currentState &&
        connection.condition.cellar == currentCellar &&
        connection.condition.string == currentString
    );
  }

  // Test the automat with a given string and log the result
  test(testString: CellarString[]) {
    const test = this.run(testString);
    if (test) console.log("\nString accepted");
    else console.log("\nString not accepted");
  }
}

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

const testString: CellarString[] = ["a", "b", "a", "c", "a", "b", "a"];

pda.test(testString);

