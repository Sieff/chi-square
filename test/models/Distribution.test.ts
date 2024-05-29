import {Distribution, DistributionData} from "../../src/models/Distribution";

let data: DistributionData;
let dist: Distribution;

beforeEach(() => {
    data = {
        rows: ["standort1", "standort2"],
        columns: ["good", "bad"],
        data: [
            [100, 10],
            [500, 50]
        ]
    };

    dist = new Distribution(data);
})

test('should get row totals', () => {
    expect(dist.rowTotals()["standort1"]).toEqual(110);
    expect(dist.rowTotals()["standort2"]).toEqual(550);
});

test('should get column totals', () => {
    expect(dist.columnTotals()["good"]).toEqual(600);
    expect(dist.columnTotals()["bad"]).toEqual(60);
});

test('should get total', () => {
    expect(dist.total()).toEqual(660);
});

test('should get degrees of freedom', () => {
    expect(dist.degreesOfFreedom()).toEqual(1);

    data = {
        rows: ["standort1", "standort2", "standort3"],
        columns: ["good", "bad", "worse"],
        data: [
            [100, 10, 0],
            [500, 50, 0],
            [0, 0, 0],
        ]
    };

    dist = new Distribution(data);

    expect(dist.degreesOfFreedom()).toEqual(4);
});

export {};