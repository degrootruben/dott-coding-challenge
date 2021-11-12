import * as readline from "node:readline";

interface Bitmap {
    width: number,
    height: number,
    data: number[]
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
    console.log("Received all bitmaps! Now the calculation of the distances will start.");

    let distanceString: string = "";

    for (let i = 0; i < bitmaps.length; i++) {
        let currentBitmap = bitmaps[i];

        for (let currentPixel = 0; currentPixel < currentBitmap.data.length; currentPixel++) {
            let currentCol = Math.round(currentPixel % currentBitmap.width);
            let currentRow = Math.round(currentPixel / currentBitmap.width);
            let distance = 0;

            if (currentBitmap.data[currentPixel] == 0) {
                let distances = new Set<number>();
                let has1One: boolean = false;

                for (let comparePixel = 0; comparePixel < currentBitmap.data.length; comparePixel++) {
                        if (currentBitmap.data[comparePixel] == 1) {
                            has1One = true;
                            let compareCol = Math.round(comparePixel % currentBitmap.width);
                            let compareRow = Math.round(comparePixel/ currentBitmap.width);

                            distances.add(calculateDistance(currentRow, currentCol, compareRow, compareCol));
                        }
                }

                if (has1One)
                    distance = Math.min(...Array.from(distances.values()));
            }

            distanceString += distance + " ";

            if ((currentPixel + 1) % currentBitmap.width == 0) {
                distanceString += '\n';
            }
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
        bitmaps.push({ width, height, data: [] });
        bitmaps[bitmapIndex].data = new Array<number>();

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
            bitmaps[bitmapIndex].data.push(parseInt(c));
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