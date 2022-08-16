#!/usr/bin/env zx
const Filic = require("filic");
const Path = require("path");
const fs = new Filic(process.cwd());
const PIResearchDir = fs.open("dir:.pi.research");
const PIFile = PIResearchDir.open("file:value-of-pi");
const Big = require("./big.js");

const FetchPI = async (start = 0, number = 1000) => {
    const res = await fetch(`https://api.pi.delivery/v1/pi?start=${start}&numberOfDigits=${number}`);
    try {
        const data = await res.json();
        return data?.content || "";
    } catch {
        return "";
    }
}

let Cache = {};

Cache.set = (PI = "") => {
    if (PIFile.content?.length >= PI.length) {
        return false;
    }

    PIFile.write(PI)

    return true;
}

Cache.get = () => {
    return PIFile.content || null
}

Cache.cachedDigits = () => {
    return PIFile.content?.length || 0
}

Cache.reset = () => {
    PIFile.delete()
    return true;
}

const ApplyDot = (PI) => {
    return "3." + PI.slice(1, PI.length);
}

const RemoveDot = (n) => {
    return n.replace(/\./g, '');
}

const GetPI = async (numberOfDigits, big = false, dot = false, MAX = 1000) => {
    let PI = "";

    const cachedPI = Cache.get();
    const cachedDigits = Cache.cachedDigits();
    const absoluteNumberOfDigits = numberOfDigits - cachedDigits;

    if (cachedPI !== null && cachedDigits >= numberOfDigits) {
        PI = cachedPI.slice(0, numberOfDigits);
    }

    if (cachedDigits <= numberOfDigits) {
        if (cachedPI !== null) {
            PI = cachedPI
        }

        const count = absoluteNumberOfDigits / MAX;
        const integer = Math.floor(count);

        for (let i = 1; i <= integer; i++) {
            const pi = await FetchPI(PI.length, MAX);
            PI += pi;
            Cache.set(PI);
        }

        const remaining = numberOfDigits - PI.length;
        if (remaining !== 0) {
            const remainingPi = await FetchPI(PI.length, remaining);
            PI += remainingPi;
        }

        if (dot === true) {
            PI = ApplyDot(PI);
        }
    }
    Cache.set(PI);

    if (big === true) {
        Big.DP = PI.length;

        PI = Big(ApplyDot(PI))
    }
    return PI;
}

GetPI.Cache = Cache;
GetPI.ApplyDot = ApplyDot;
GetPI.RemoveDot = RemoveDot;

module.exports = GetPI;