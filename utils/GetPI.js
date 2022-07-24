#!/usr/bin/env zx

const FetchPI = async (start = 0, number = 1000) => {
    const res = await fetch(`https://api.pi.delivery/v1/pi?start=${start}&numberOfDigits=${number}`);
    try {
        const data = await res.json();
        return data?.content || "";
    } catch {
        return "";
    }
}

const GetPI = async (numberOfDigits, dot = false, MAX = 1000) => {
    let PI = "";

    const count = numberOfDigits / MAX;
    const integer = Math.floor(count);

    for (let i = 1; i <= integer; i++) {
        const pi = await FetchPI(PI.length, MAX);

        PI += pi;
    }

    const remaining = numberOfDigits - PI.length;
    if (remaining !== 0) {
        const remainingPi = await FetchPI(PI.length, remaining);
        PI += remainingPi;
    }

    if (dot === true) {
        PI = "3." + PI.slice(2, PI.length)
    }

    return PI;
}

module.exports = GetPI;