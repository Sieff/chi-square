import {Distribution, DistributionData} from "../models/Distribution";
import {add} from "../util/reducerFunctions";
import {chiSquareCriticalValue} from "../util/chiSquareCriticalValue";

export interface ChiSquareTestResult {
    /**
     * Calculated Chi-Square value from data
     */
    calculatedChiSquareValue: number;
    /**
     * Critical Chi-Square value for significance level and dof
     */
    criticalChiSquareValue: number;
    /**
     * Significance Level
     */
    significanceLevel: number;
    /**
     * Cramers V value calculated from result
     */
    cramersV: number;
    /**
     * Calculated residuals for each cell
     */
    residuals: number[][];
    /**
     * Sum of absolutes of residuals to measure impact of each row on Chi-Square value
     */
    rowImpact: number[];
    /**
     * Test result.
     * True if null hypothesis has to be accepted.
     * False if null hypothesis can be rejected
     */
    nullHypothesis: boolean;
}

/**
 * Performs a chi-square test and returns Result with additional metrics.
 *
 * @param dist Distribution object with data
 * @param alpha Significance level
 * @return ChiSquareTestResult
 */
function chiSquare(dist: Distribution, alpha: number = 0.05): ChiSquareTestResult {
    const criticalChiSquareValue = chiSquareValue(alpha, dist.degreesOfFreedom());
    const calculatedChiSquareValue = chiSquareTestValue(dist);
    const cramV = cramersV(dist, calculatedChiSquareValue);
    const resid = residuals(dist);
    const rowImpact = rowImpactRating(dist);

    return {
        calculatedChiSquareValue,
        criticalChiSquareValue,
        significanceLevel: alpha,
        cramersV: cramV,
        residuals: resid,
        rowImpact,
        nullHypothesis: calculatedChiSquareValue < criticalChiSquareValue
    };
}

/**
 * Calculates the sum of the absolute residuals.
 * @param dist Distribution object with data
 */
function rowImpactRating(dist: Distribution): number[] {
    return residuals(dist).map((row) => row.map(value => Math.abs(value)).reduce(add, 0));
}


/**
 * Calculates the residuals for each cell.
 * @param dist Distribution object with data
 */
function residuals(dist: Distribution): number[][] {
    const expected = expectedValues(dist);
    return expected.data.map((row, i) => {
        return row.map((expected, j) => {
            const value = dist.data[i][j];
            return (value - expected) / Math.sqrt(expected);
        })
    })
}

/**
 * Calculates Cramers V for a chi-square test result value
 * @param dist Distribution object with data
 * @param chiSquaredValue Chi-Square test result value
 */
function cramersV(dist: Distribution, chiSquaredValue: number): number {
    const m = Math.min(...dist.shape());
    const n = dist.total();
    return Math.sqrt(chiSquaredValue / (n * (m - 1)));
}

/**
 * Calculates the critical chi-square value
 * @param alpha Significance level
 * @param dof Degrees of freedom
 */
function chiSquareValue(alpha: number, dof: number): number {
    return chiSquareCriticalValue(alpha, dof);
}

/**
 * Calculates the chi-square test value for a given distribution
 * @param dist Distribution object with data
 */
function chiSquareTestValue(dist: Distribution): number {
    const expected = expectedValues(dist).data;

    return dist.data.map((rowValues, row) => {
        return rowValues.map((value, column) => {
            return (value - expected[row][column])**2 / expected[row][column]
        }).reduce(add, 0);
    }).reduce(add, 0);
}

/**
 * Calculates expected values for each cell using the marginals
 * @param dist Distribution object with data
 * @return DistributionData
 */
function expectedValues(dist: Distribution): DistributionData {
    const rowTotals = dist.rowTotals();
    const columnTotals = dist.columnTotals();
    const total = dist.total();

    const expectedValues = dist.rows.map((row) => {
        return dist.columns.map((column) => {
            return (rowTotals[row] * columnTotals[column]) / total
        })
    })

    return {
        rows: dist.rows,
        columns: dist.columns,
        data: expectedValues
    }
}

export {chiSquare, expectedValues, cramersV, residuals, chiSquareValue, chiSquareTestValue, rowImpactRating}