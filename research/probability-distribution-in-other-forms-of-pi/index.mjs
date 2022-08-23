import { spinner } from 'zx/experimental'

const GetPI = require("../../utils/GetPI");
const Big = require("../../utils/big.js");
const Filic = require("filic");
const path = require("path");
const fs = Filic.create(path.resolve(__dirname));

const logFile = fs.open(`file:log/${Date.now()}`);

console.stdLog = console.log.bind(console);
console.log = function () {
    logFile.append('\n');
    logFile.append(`[${Date.now()}] `);
    logFile.append(arguments);
    console.stdLog.apply(console, arguments);
}


const CollectData = async (NumberOfDigits, formName, formOperation) => {
    Big.DP = NumberOfDigits;

    // This Data Object Represents the number of counted digit and total Number of digits that was counted
    let Data = {
        form: formName,
        numbers: {
            0: {
                count: 0,
                probability: 0,
                percentage: 0,
            },
            1: {
                count: 0,
                probability: 0,
                percentage: 0,
            },
            2: {
                count: 0,
                probability: 0,
                percentage: 0,
            },
            3: {
                count: 0,
                probability: 0,
                percentage: 0,
            },
            4: {
                count: 0,
                probability: 0,
                percentage: 0,
            },
            5: {
                count: 0,
                probability: 0,
                percentage: 0,
            },
            6: {
                count: 0,
                probability: 0,
                percentage: 0,
            },
            7: {
                count: 0,
                probability: 0,
                percentage: 0,
            },
            8: {
                count: 0,
                probability: 0,
                percentage: 0,
            },
            9: {
                count: 0,
                probability: 0,
                percentage: 0,
            }
        },
        totalDigits: 0
    };

    // Globals Variables that will be used all over script
    const Globals = {
        NumberOfDigits,
        FORM: "",
        FORM_Splitted: []
    }

    await spinner("Fetching PI...", async () => {
        $.verbose = true
        // Fetching PI
        const PI = await GetPI(Globals.NumberOfDigits, true)
        // Operation on PI
        console.log(`Operating for ${formName}-${NumberOfDigits}...`)
        Globals.FORM = formOperation?.(PI);
        // Splitting PI
        Globals.FORM_Splitted = GetPI.RemoveDot(Globals.FORM.toString()).split('');
    })

    // Setting total digits to `Data`
    Data.totalDigits = Globals.NumberOfDigits;


    await spinner(async () => {

        // Running the loop to count every digit
        for (let i = 0; i < Globals.FORM_Splitted.length; i++) {
            if (i % 100 === 0) {
                process.stdout.write(`Processing ${i}th digit`);
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
            }
            const digitString = Globals.FORM_Splitted[i];
            const digitNumber = parseInt(digitString);
            if (digitString === '.') { continue; };

            Data.numbers[digitNumber].count++;
            Data.numbers[digitNumber].probability = Data.numbers[digitNumber].count / Data.totalDigits;
            Data.numbers[digitNumber].percentage = Data.numbers[digitNumber].probability * 100;
        }

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
    });

    return Data;
}

const Sets = [1e2, 1e3, 1e4, 1e5, 1e6, 3e6];
const Forms = [
    {
        formName: '1-upon-pi',
        formOperation: (PI) => {
            return Big(1).div(PI);
        }
    },
    {
        formName: 'pi-square',
        formOperation: (PI) => {
            return PI.pow(2);
        }
    },
    {
        formName: 'square-root-of-pi',
        formOperation: (PI) => {
            return PI.sqrt();
        },
    },
    {
        formName: 'pi-cube',
        formOperation: (PI) => {
            return PI.pow(3);
        },
    }
];
const Data = fs.open("dir:data");

for (let i = 0; i < Sets.length; i++) {
    const NumberOfDigits = Sets[i];

    for (let j = 0; j < Forms.length; j++) {
        const form = Forms[j];
        try {
            let startTime = Date.now();
            const data = await CollectData(NumberOfDigits, form.formName, form.formOperation);
            const DataFile = Data.open(`file:${form.formName}-${NumberOfDigits}.json`);
            DataFile.write(JSON.stringify(data, null, 4));
            console.log(`Written Data in ${DataFile.filename}, took ${(Date.now() - startTime) / 1000}s`);
        } catch (e) {
            console.log(e);
            continue;
        }

    }

}

$`shutdown /s /f /t 240`