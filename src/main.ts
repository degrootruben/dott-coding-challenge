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
 * Calculates and returns the distance between point (line1Num, col1Num) and point (line2Num, col2Num).
 */
function calculateDistance(line1Num: number, col1Num: number, line2Num: number, col2Num: number) {
    return Math.round(Math.abs(line1Num - line2Num) + Math.abs(col1Num - col2Num));
}

function calculateDistances() {
    console.log("Received all bitmaps! Now the calculation of the distances will start.");

    for (let i = 0; i < bitmaps.length; i++) {
        let currentBitmap = bitmaps[i];
        let distanceString: string = "";

        for (let j = 0; j < currentBitmap.data.length; j++) {
            let currentPixel = currentBitmap.data[j];
            let curX = j % currentBitmap.width + 1;
            let curY = j / currentBitmap.height;
            let distance = 0;

            if (currentPixel == 0) {
                for (let k = 0; k < currentBitmap.data.length; k++) {
                    let comparePixel = currentBitmap.data[k];
                    let comX = k % currentBitmap.width + 1;
                    let comY = k / currentBitmap.height;

                    distance = calculateDistance(curY, curX, comY, comX);
                    distanceString += distance + " ";
                }
            }

            if (j % currentBitmap.width == 0) {
                console.log(distanceString);
                distanceString = "";
            }
        }
    }

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
    for (let i = 0; i < line.length; i++) {
        let c: string = line.charAt(i);
        if (!(c == '0' || c == '1' || line.length == currentWidth)) {
            console.log("Error while reading bitmap from stdin:\n",
                " Every line of the bitmap should consist of 0's and 1's.\n",
                " The amount of 0's and 1's should be equal to the specified width.");
        } else {
            bitmaps[bitmapIndex].data.push(parseInt(c));
        }
    }
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