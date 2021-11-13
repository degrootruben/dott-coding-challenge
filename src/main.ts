import * as readline from "node:readline";

interface Bitmap {
    width: number,
    height: number,
    data: number[][]
}

let numberOfBitmaps: number = 0;
let bitmapIndex: number = 0;
let bitmaps = new Array<Bitmap>();

let currentLine: number = 0;
let currentWidth: number = 0;
let currentHeight: number = 0;
let firstLineOfBitmap: boolean = true;

let firstLineOfInput: boolean = true;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on("line", function (line: string) {
    if (firstLineOfInput) {
        parseNumOfTestCases(line);
    } else {
        if (firstLineOfBitmap) {
            parseWidthAndHeight(line);
        } else {
            parseBitmap(line);
        }
    }
});

/*
 * This function calculates all the distances for every bitmap in the bitmaps array and outputs it
 * to the console.
 */
function calculateDistances() {
    let distanceString: string = "";

    for (let i = 0; i < bitmaps.length; i++) {
        let currentBitmap = bitmaps[i];

        for (let rowCur = 0; rowCur < currentBitmap.data.length; rowCur++) {
            for (let colCur = 0; colCur < currentBitmap.data[rowCur].length; colCur++) {
                let distanceSet = new Set<number>();

                for (let rowComp = 0; rowComp < currentBitmap.data.length; rowComp++) {
                    for (let colComp = 0; colComp < currentBitmap.data[rowComp].length; colComp++) {

                        if (currentBitmap.data[rowCur][colCur] == 0 && currentBitmap.data[rowComp][colComp] == 1) {
                            distanceSet.add(calculateDistance(rowCur, colCur, rowComp, colComp));
                        } else if (currentBitmap.data[rowCur][colCur] == 1) {
                            distanceSet.add(0);
                        }
                    }
                }
                distanceString += Math.min(...Array.from(distanceSet.values())) + " ";
            }
            distanceString += '\n';
        }
    }
    console.log(distanceString);
}

/*
 * Calculates and returns the distance between point (line1Num, col1Num) and point (line2Num, col2Num).
 */
function calculateDistance(row1: number, col1: number, row2: number, col2: number) {
    return Math.abs(row1 - row2) + Math.abs(col1 - col2);
}

/*
 * Parses the number of test cases from line.
 */
function parseNumOfTestCases(line: string) {
    const t = parseInt(line);

    if (isNaN(t) || t < 1 || t > 1000) {
        console.log("Error while reading number of test cases from stdin:\n",
            " Please enter a number in the range of 1 and 1000.");
    } else {
        numberOfBitmaps = t;
        firstLineOfInput = false;
    }
}

/*
 * Parses the width and height from line.
 */
function parseWidthAndHeight(line: string) {
    const str = line.split(' ');
    const width = parseInt(str[1]);
    const height = parseInt(str[0]);

    if (isNaN(width) || isNaN(height) || width < 1 || width > 182 || height < 1 || height > 182) {
        console.log("Error while reading width and height from stdin:\n",
            " Please enter two numbers (in the range of 1 and 182) seperated by a space.");
    } else {
        bitmaps.push({ width, height, data: [[]] });
        bitmaps[bitmapIndex].data = new Array<number[]>();

        currentWidth = bitmaps[bitmapIndex].width;
        currentHeight = bitmaps[bitmapIndex].height;

        firstLineOfBitmap = false;
    }
}

/*
 * Parses the bitmap from line and loads it into it's data array.
 */
function parseBitmap(line: string) {
    let error: boolean = false;

    bitmaps[bitmapIndex].data[currentLine] = [];

    for (let i = 0; i < line.length; i++) {
        let c: string = line.charAt(i);
        if (!(c == '0' || c == '1')) {
            error = true;
            console.log("Error while reading bitmap from stdin:\n",
                        " Every line of the bitmap should consist of 0's and 1's.\n");
        } else if (line.length != currentWidth) {
            error = true;
            console.log("Error while reading bitmap from stdin:\n",
                        " The amount of 0's and 1's should be equal to the specified width.");
        } else {
            bitmaps[bitmapIndex].data[currentLine][i] = parseInt(c);
        }
    }

    if (!error)
        currentLine++;

    if (currentLine == currentHeight) {
        if (bitmapIndex + 1 == numberOfBitmaps) {
            calculateDistances();
        } else {
            currentLine = 0;
            firstLineOfBitmap = true;
            bitmapIndex++;
        }
    }
}