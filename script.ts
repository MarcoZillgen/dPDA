type CellarString = string | null;

type RunOnce = { newCellar: CellarString[]; newState: string } | null;

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

class PDA {
  connections: Connection[];
  startState: string;
  endState: string;
  constructor(connections: Connection[], startState: string, endState: string) {
    this.connections = connections;
    this.startState = startState;
    this.endState = endState;
  }

  run(testString: CellarString[]) {
    let currentState: string = this.startState;
    let cellar: CellarString[] = ["Z"];

    for (let i = 0; i < testString.length; i++) {
      console.log(cellar);
      console.log(currentState);

      const currentString = testString[i];
      const currentCellar: CellarString =
        cellar.length > 0 ? cellar.pop()! : null;
      const currentConnections = this.findConnections(
        currentState,
        currentString,
        currentCellar
      );

      if (currentConnections.length == 0) return false;

      currentState = currentConnections[0].endState;
      cellar = [
        ...cellar,
        ...currentConnections[0].condition.newCellar
          .filter((cellarStr) => cellarStr != null)
          .reverse(),
      ];
    }

    if (JSON.stringify(cellar) == JSON.stringify(["Z"])) return true;
    else return false;
  }

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

  test(testString: CellarString[]) {
    const test = this.run(testString);
    if (test) console.log("\nTest passed");
    else console.log("\nTest failed");
  }
}

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
