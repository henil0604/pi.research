# UTILS

This Directory Contains Utility Functions For research of PI.

## GetPI.js

Allows to get the PI digits up to certain number of digits

```js
const OneThousandDigitsPI = await GetPI(1000);
```

- `params`
    - `numberOfDigits`: Number of Digits that you want to fetch
    - `big`: If true, function will return [`big.js`](https://www.npmjs.com/package/big-js) Object 
    - `dot`: If you need dot after `3` like `3.141...`
    - `MAX`: Maximum number of digits you want to fetch at once