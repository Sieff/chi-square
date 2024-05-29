import {chiSquare, ChiSquareTestResult} from "../../src/services/ChiSquareService";
import {Distribution, DistributionData} from "../../src/models/Distribution";

let data: DistributionData;

function runChiSquare(testname: string, data: DistributionData, alpha: number = 0.05): ChiSquareTestResult {
    const dist = new Distribution(data);
    const result = chiSquare(dist, alpha)

    console.log(testname, result);

    return result
}

test('should find variables not independent', () => {
    data = {
        rows: ["standort1", "standort2", "standort3", "komischerStandort"],
        columns: ["good", "bad"],
        data: [
            [90, 10],
            [90, 10],
            [45, 5],
            [50, 50]
        ]
    };

    const result = runChiSquare('should find variables not independent', data, 0.05)
    expect(result.nullHypothesis).toBeFalsy();
});

test('should find variables independent', () => {
    data = {
        rows: ["standort1", "standort2", "standort3", "standort4"],
        columns: ["good", "bad"],
        data: [
            [90, 10],
            [90, 10],
            [45, 5],
            [450, 50]
        ]
    };

    const result = runChiSquare('should find variables independent', data, 0.05)
    expect(result.nullHypothesis).toBeTruthy();
});

test('should run on small scale', () => {
    data = {
        rows: ["standort1", "standort2"],
        columns: ["good", "bad"],
        data: [
            [1000, 500],
            [800, 800]
        ]
    };

    const result = runChiSquare('should run on small scale', data, 0.05)
    expect(result.nullHypothesis).toBeFalsy();
});

test('should run on big scale', () => {
    data = {
        rows: ["standort1", "standort2"],
        columns: ["good", "bad"],
        data: [
            [1000000, 500000],
            [800000, 800000]
        ]
    };

    const result = runChiSquare('should run on big scale', data, 0.05)
    expect(result.nullHypothesis).toBeFalsy();
});

test('should find complete association', () => {
    data = {
        rows: ["standort1", "standort2"],
        columns: ["good", "bad"],
        data: [
            [0, 100],
            [100, 0]
        ]
    };

    const result = runChiSquare('should find complete association', data, 0.05);
    expect(result.cramersV).toEqual(1);
});

test('should find weak association', () => {
    data = {
        rows: ["standort1", "standort2"],
        columns: ["good", "bad"],
        data: [
            [110, 40],
            [70, 40],
        ]
    };

    const result = runChiSquare('should find weak association', data, 0.05);
    expect(result.cramersV).toBeLessThan(0.2);
});

test('should find no association', () => {
    data = {
        rows: ["standort1", "standort2"],
        columns: ["good", "bad"],
        data: [
            [50, 40],
            [50, 40],
        ]
    };

    const result = runChiSquare('should find no association', data, 0.05);
    expect(result.cramersV).toEqual(0);
});

test('should find largest impact row', () => {
    data = {
        rows: ["standort1", "komischerStandort", "standort3", "standort4"],
        columns: ["good", "bad"],
        data: [
            [1000, 1000],
            [200, 2000],
            [100, 100],
            [1000, 1000]
        ]
    };

    const result = runChiSquare('should find largest impact row', data, 0.05);

    const highestImpact = Math.max(...result.rowImpact);
    const highestImpactIndex = result.rowImpact.indexOf(highestImpact);
    const suspiciousIndex = data.rows.indexOf("komischerStandort");

    expect(data.rows[highestImpactIndex]).toEqual("komischerStandort");
    expect(highestImpact).toEqual(result.rowImpact[suspiciousIndex]);
    expect(highestImpactIndex).toEqual(suspiciousIndex);
});

export {};