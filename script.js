"use strict";
// Connection between states
class Connection {
    constructor(startState, endState, conditions, finalState = false) {
        this.startState = startState;
        this.endState = endState;
        this.condition = conditions;
        this.finalState = finalState;
    }
}
// Condition for a connection
class Condition {
    constructor(string, cellar, newCellar) {
        this.string = string;
        this.cellar = cellar;
        this.newCellar = newCellar;
    }
}
// Pushdown automat class
class PDA {
    constructor(connections, startState, endState) {
        this.connections = connections;
        this.startState = startState;
        this.endState = endState;
    }
    // Run the automat completely
    run(testString) {
        let currentState = this.startState;
        let cellar = ["Z"];
        // Run the automat until the end state is reached
        for (let i = 0; i < testString.length; i++) {
            console.log(cellar);
            console.log(currentState);
            // Find all connections that match the current state, string and cellar
            const currentString = testString[i];
            const currentCellar = cellar.length > 0 ? cellar.pop() : null;
            const currentConnections = this.findConnections(currentState, currentString, currentCellar);
            // If no connections are found, throw an error
            if (currentConnections.length == 0)
                throw new Error("No connections found for state " +
                    currentState +
                    " with string " +
                    currentString +
                    " and cellar " +
                    currentCellar +
                    " at index " +
                    i);
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
        if (JSON.stringify(cellar) == JSON.stringify(["Z"]))
            return true;
        // If not, throw an error
        else
            throw new Error("Cellar is not empty at the end of the string");
    }
    // Find all connections that match the current state, string and cellar
    findConnections(currentState, currentString, currentCellar) {
        return this.connections.filter((connection) => connection.startState == currentState &&
            connection.condition.cellar == currentCellar &&
            connection.condition.string == currentString);
    }
    // Test the automat with a given string and log the result
    test(testString) {
        const test = this.run(testString);
        if (test)
            console.log("\nString accepted");
        else
            console.log("\nString not accepted");
    }
    
    // Test the automat with a given string and log the result
    view(testString,div) {
        const test = this.run(testString);
        if (test)
            console.log("\nString accepted");
        else
            console.log("\nString not accepted");
    }
}


export { Condition, Connection, PDA };