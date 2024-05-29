import {Distribution, DistributionData} from "../../src/models/Distribution";
import {chiSquare, chiSquareTestValue, chiSquareValue, expectedValues} from "../../src/services/ChiSquareService";

let data: DistributionData;
let dist: Distribution;

beforeEach(() => {
    data = {
        rows: ["standort1", "standort2"],
        columns: ["good", "bad"],
        data: [
            [90, 10],
            [700, 200]
        ]
    };

    dist = new Distribution(data);
})

test('should get expected values', () => {
    const expected = {
        rows: ["standort1", "standort2"],
        columns: ["good", "bad"],
        data: [
            [79, 21],
            [711, 189]
        ]
    };
    expect(expectedValues(dist)).toEqual(expected);
});

test('should calculate correct chi square value', () => {
    const expected = ((90 - 79)**2 / 79) + ((10 - 21)**2 / 21) + ((700 - 711)**2 / 711) + ((200 - 189)**2 / 189);
    expect(chiSquareTestValue(dist)).toEqual(expected);
});

test('should get correct chi square significance', () => {
    const expected = 3.841;
    expect(chiSquareValue(0.05, 1)).toBeCloseTo(expected, 3);
});

test('should calculate correct result', () => {
    const expectedTestStatistic = ((90 - 79)**2 / 79) + ((10 - 21)**2 / 21) + ((700 - 711)**2 / 711) + ((200 - 189)**2 / 189);
    const expectedChiSquareValue = 3.841;

    const result = chiSquare(dist, 0.05);
    expect(result.nullHypothesis).toBeFalsy();
    expect(result.calculatedChiSquareValue).toEqual(expectedTestStatistic);
    expect(result.criticalChiSquareValue).toBeCloseTo(expectedChiSquareValue, 3);
});

test('should calculate correct residuals', () => {
    const expectedResiduals = [
        [(90 - 79) / Math.sqrt(79), (10 - 21) / Math.sqrt(21)],
        [(700 - 711) / Math.sqrt(711), (200 - 189) / Math.sqrt(189)]
    ];

    const result = chiSquare(dist, 0.05);
    expect(result.residuals).toEqual(expectedResiduals);
});

test('should calculate correct rowImpact', () => {
    const expectedRowImpacts = [
        Math.abs((90 - 79) / Math.sqrt(79)) + Math.abs((10 - 21) / Math.sqrt(21)),
        Math.abs((700 - 711) / Math.sqrt(711)) + Math.abs((200 - 189) / Math.sqrt(189))
    ];

    const result = chiSquare(dist, 0.05);
    expect(result.rowImpact).toEqual(expectedRowImpacts);
});

export {};