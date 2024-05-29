import {add} from "../util/reducerFunctions";

interface DistributionData {
    rows: string[];
    columns: string[];
    data: number[][];
}

class Distribution {
    public rows: string[];
    public columns: string[];
    public data: number[][];

    constructor(distributionProps: DistributionData) {
        this.rows = distributionProps.rows;
        this.columns = distributionProps.columns;
        this.data = distributionProps.data;
    }

    public degreesOfFreedom(): number {
        const rows = this.rows.length;
        const columns = this.columns.length;
        return (rows - 1) * (columns - 1)
    }

    public shape(): number[] {
        return [this.rows.length, this.columns.length];
    }

    public rowTotals(): { [key: string]: number } {
        const rowEntries = this.data.map((rowValues, i) => {
            return [this.rows[i], rowValues.reduce(add, 0)];
        })

        return Object.fromEntries(rowEntries)
    }

    public columnTotals(): { [key: string]: number } {
        const columnEntries = this.columns.map((column, i) => {
            return [column, this.data.map(values => values[i]).reduce(add, 0)]
        })

        return Object.fromEntries(columnEntries);
    }

    public total(): number {
        return this.data.reduce((prev, current) => {
            return prev + current.reduce(add, 0)
        }, 0);
    }
}

export type {DistributionData};
export {Distribution};
