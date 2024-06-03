import {Distribution, DistributionData} from "../../src";

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

test('should throw error for invalid data (negative values)', () => {
    data = {
        rows: ["row1", "row2"],
        columns: ["good", "bad"],
        data: [
            [-1, 10],
            [10, 10],
        ]
    };

    const testCall = () => {
        return new Distribution(data);
    }

    expect(testCall).toThrow(Error);
});

test('should throw error for invalid data (NaN values)', () => {
    data = {
        rows: ["row1", "row2"],
        columns: ["good", "bad"],
        data: [
            [NaN, 10],
            [10, 10],
        ]
    };

    const testCall = () => {
        return new Distribution(data);
    }

    expect(testCall).toThrow(Error);
});

test('should throw error for invalid data (rows mismatch)', () => {
    data = {
        rows: ["row1", "row2"],
        columns: ["good", "bad"],
        data: [
            [10, 10],
        ]
    };

    const testCall = () => {
        return new Distribution(data);
    }

    expect(testCall).toThrow(Error);
});

test('should throw error for invalid data (column mismatch)', () => {
    data = {
        rows: ["row1", "row2"],
        columns: ["good", "bad"],
        data: [
            [10],
            [10],
        ]
    };

    const testCall = () => {
        return new Distribution(data);
    }

    expect(testCall).toThrow(Error);
});

test('should throw error for invalid data (unequal rows)', () => {
    data = {
        rows: ["row1", "row2"],
        columns: ["good", "bad"],
        data: [
            [10, 10],
            [10],
        ]
    };

    const testCall = () => {
        return new Distribution(data);
    }

    expect(testCall).toThrow(Error);
});


test('should throw error for invalid data (no data)', () => {
    data = {
        rows: [],
        columns: [],
        data: [
        ]
    };

    const testCall = () => {
        return new Distribution(data);
    }

    expect(testCall).toThrow(Error);
});


test('should throw error for invalid data (no columns)', () => {
    data = {
        rows: ["row1", "row2"],
        columns: [],
        data: [
            [],
            []
        ]
    };

    const testCall = () => {
        return new Distribution(data);
    }

    expect(testCall).toThrow(Error);
});


test('should throw error for invalid data (no rows)', () => {
    data = {
        rows: [],
        columns: ["column1", "column2"],
        data: [
        ]
    };

    const testCall = () => {
        return new Distribution(data);
    }

    expect(testCall).toThrow(Error);
});

test('should not throw error for minimal valid data', () => {
    data = {
        rows: ["row1"],
        columns: ["good"],
        data: [
            [0],
        ]
    };

    const testCall = () => {
        return new Distribution(data);
    }

    expect(testCall).not.toThrow(Error);
});

export {};