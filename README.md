### ⚠️🚨 Deprecation Notice 🚨⚠️ 

**This package has been deprecated and moved to [`@folge3/chi-square`](https://www.npmjs.com/package/@folge3/chi-square).** \
Please update your dependencies and switch to the new package to continue receiving updates and support.
Thank you for your understanding!

# Chi-Square

This package contains functions to calculate Chi-Square critical values as well as performing a Chi-Square statistical test.

## Installation

    npm install @steffen-f3/chi-square

## Usage

```js

import {chiSquare, DistributionData, Distribution, ChiSquareTestResult, chiSquareCriticalValue} from "@steffen-f3/chi-square";

const data: DistributionData = {
    rows: ['row1', 'row2'],
    columns: ['column1', 'column2'],
    data: [
        [52, 27],
        [23, 56]
    ]
}

const distribution: Distribution = new Distribution(data);

// Run chi-square test with 5% uncertainty 
const result: ChiSquareTestResult = chiSquare(distribution, 0.05);

console.log(result);

// Get critical value for significance level 0.05 and 1 degree of freedom. 
const criticalValue = chiSquareCriticalValue(0.05, 1);

// ~3.841
console.log(criticalValue)
```

## Development

### Testing

    npm run test

### Deployment

1. Bump version number in package.json
2. Run build script
3. Publish via npm