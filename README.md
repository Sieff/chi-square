# Chi-Square

This package contains functions to calculate Chi-Square critical values as well as performing a Chi-Square statistical test.

## Installation

    npm install @steffen-f3/chi-square

## Usage

```js

import {chiSquare, DistributionData, Distribution, ChiSquareTestResult} from "@steffen-f3/chi-square";

const data: DistributionData = {
    rows: ['row1', 'row2'],
    columns: ['column1', 'column2'],
    data: [
        [52, 27],
        [23, 56]
    ]
}

const distribution: Distribution = new Distribution(data);

// Run chi-square test with 5% Uncertainty 
const result: ChiSquareTestResult = chiSquare(distribution, 0.05);

console.log(result);
```
