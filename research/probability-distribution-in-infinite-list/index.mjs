import { spinner } from 'zx/experimental'
import TPromise from "thread-promises"

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


const CollectData = async (label, Generator, props) => {
    const START_TIME = Date.now();

    // This Data Object Represents the number of counted digit and total Number of digits that was counted and other information
    let Data = {
        label,
        numbers: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
        },
        digits: 0,
        counted: 0,
    };

    // Globals Variables that will be used all over script
    const Globals = {
        Number: "",
        Number_Splitted: [],
        File: null
    }

    await spinner("Generating Number...", async () => {
        $.verbose = true
        // Generating Number
        const Generated = await Generator(props);
        Globals.Number = Generated.Number;
        Globals.File = Generated.File;
        Data.digits = Generated.digits;
        Globals.Number_Splitted = GetPI.RemoveDot(Globals.Number.toString()).split('');
    })

    // Setting total digits to `Data` and Big.DP
    Data.digits = Big.DP = Data.digits;

    await spinner(async () => {

        // Running the loop to count every digit
        for (let i = 0; i < Data.digits; i++) {
            if (i % 100 === 0) {
                console.log(`Processing ${i}th digit`);
            }

            if (i % 100 === 0) {
                // Generate Temp Data Object
                let data = JSON.parse(JSON.stringify(Data));

                for (const key in data.numbers) {

                    let count = data.numbers[key];

                    data.numbers[key] = {
                        count: count,
                        probability: (count / data.counted) || 0
                    };

                }

                console.log(`Saving Data in "${Globals.File.filename}"`);
                Globals.File.write(JSON.stringify(data, null, 4));

            }

            const digitString = Globals.Number_Splitted[i];
            const digitNumber = parseInt(digitString);

            if (digitString === '.') { continue; };

            Data.numbers[digitNumber]++;
            Data.counted++;

        }

    });

    let data = JSON.parse(JSON.stringify(Data));

    for (const key in data.numbers) {

        let count = data.numbers[key];
        data.numbers[key] = {
            count: count,
            probability: (count / data.counted) || 0
        };
    }

    console.log(`Saving Final Data in "${Globals.File.filename}" ${Date.now() - START_TIME}ms`);
    Globals.File.write(JSON.stringify(data, null, 4));

    return data;
}

const Data = fs.open(`dir:data`)


const Generators = [
    {
        generator: (props) => {
            console.log(`Generating Square Root of 2 with ${props.Digits} digits`)
            Big.DP = props.Digits;
            return {
                Number: Big(2).sqrt(),
                digits: props.Digits,
                File: Data.open(`square-root-of-2-${props.Digits}.json`)
            }
        },
        sets: [1e2, 1e3, 1e4, 1e5, 1e6, 1e7],
        label: 'square root of 2 - {digits}'
    },
    {
        generator: (props) => {
            console.log(`Generating Square Root of 3 with ${props.Digits} digits`)
            Big.DP = props.Digits;
            return {
                Number: Big(3).sqrt(),
                digits: props.Digits,
                File: Data.open(`square-root-of-3-${props.Digits}.json`)
            }
        },
        sets: [1e2, 1e3, 1e4, 1e5, 1e6, 1e7],
        label: 'square root of 3 - {digits}'
    },
];

; (async function () {

    for (let i = 0; i < Generators.length; i++) {
        const generator = Generators[i];

        if (generator.sets) {
            for (let j = 0; j < generator.sets.length; j++) {
                const Digits = generator.sets[j];
                let label = generator.label.replace('{digits}', Digits);
                new TPromise(async (resolve) => {
                    await CollectData(label, generator.generator, {
                        Digits
                    })
                })
            }
        }

    }
})()