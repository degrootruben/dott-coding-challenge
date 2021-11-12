import * as readline from "node:readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on("line", function(line: string) {
    console.log(line);
});