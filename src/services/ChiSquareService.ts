import {Distribution, DistributionData} from "../models/Distribution";
import {add} from "../util/reducerFunctions";
import {chiSquareCriticalValue} from "../util/chiSquareCriticalValue";

export interface ChiSquareTestResult {
    rows: string[];
    columns: string[];
    data: number[][];
    calculatedChiSquareValue: number;
    criticalChiSquareValue: number;
    significanceLevel: number;
    cramersV: number;
    residuals: number[][];
    rowImpact: number[];
    nullHypothesis: boolean;
}

function chiSquare(dist: Distribution, alpha: number = 0.05): ChiSquareTestResult {
    const criticalChiSquareValue = chiSquareValue(alpha, dist.degreesOfFreedom());
    const calculatedChiSquareValue = chiSquareTestValue(dist);
    const cramV = cramersV(dist, calculatedChiSquareValue);
    const resid = residuals(dist);
    const rowImpact = rowImpactRating(dist);

    return {
        rows: dist.rows,
        columns: dist.columns,
        data: dist.data,
        calculatedChiSquareValue,
        criticalChiSquareValue,
        significanceLevel: alpha,
        cramersV: cramV,
        residuals: resid,
        rowImpact,
        nullHypothesis: calculatedChiSquareValue < criticalChiSquareValue
    };
}

function rowImpactRating(dist: Distribution): number[] {
    return residuals(dist).map((row) => row.map(value => Math.abs(value)).reduce(add, 0));
}

function residuals(dist: Distribution): number[][] {
    const expected = expectedValues(dist);
    return expected.data.map((row, i) => {
        return row.map((expected, j) => {
            const value = dist.data[i][j];
            return (value - expected) / Math.sqrt(expected);
        })
    })
}

function cramersV(dist: Distribution, chiSquaredValue: number): number {
    const m = Math.min(...dist.shape());
    const n = dist.total();
    return Math.sqrt(chiSquaredValue / (n * (m - 1)));
}

function chiSquareValue(alpha: number, dof: number): number {
    return chiSquareCriticalValue(alpha, dof);
}

function chiSquareTestValue(dist: Distribution): number {
    const expected = expectedValues(dist).data;

    return dist.data.map((rowValues, row) => {
        return rowValues.map((value, column) => {
            return (value - expected[row][column])**2 / expected[row][column]
        }).reduce(add, 0);
    }).reduce(add, 0);
}

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