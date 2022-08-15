import { spinner } from 'zx/experimental'

const GetPI = require("../../utils/GetPI");
const Filic = require("filic");
const path = require("path");

const fs = Filic.create(path.resolve(__dirname));

const CollectData = async (NumberOfDigits) => {

    // This Data Object Represents the number of counted digit and total Number of digits that was counted
    let Data = {
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
        PI: "",
        PI_Splitted: []
    }

    await spinner("Fetching PI...", async () => {
        $.verbose = true
        // Fetching PI
        Globals.PI = await GetPI(Globals.NumberOfDigits)
        // Splitting PI
        Globals.PI_Splitted = Globals.PI.split('');
    })

    // Setting total digits to `Data`
    Data.totalDigits = Globals.NumberOfDigits;

    await spinner(async () => {

        // Running the loop to count every digit
        for (let i = 0; i < Globals.PI_Splitted.length; i++) {
            const digitString = Globals.PI_Splitted[i];
            const digitNumber = parseInt(digitString);

            Data.numbers[digitNumber].count++;
            Data.numbers[digitNumber].probability = Data.numbers[digitNumber].count / Data.totalDigits;
            Data.numbers[digitNumber].percentage = Data.numbers[digitNumber].probability * 100;
        }

    });

    return Data;
}

const Sets = [1e2, 1e3, 1e4, 1e5, 1e6];
const Data = fs.open("dir:data");

Sets.forEach(async NumberOfDigits => {
    const DataFile = Data.open(`file:${NumberOfDigits}.json`);
    const data = await CollectData(NumberOfDigits);
    DataFile.write(data);
    console.log(`Written Data in ${DataFile.filename}`);
})