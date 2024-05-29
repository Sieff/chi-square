import {add} from "../util/reducerFunctions";

/**
 * Raw data object used to create a Distribution
 */
interface DistributionData {
    rows: string[];
    columns: string[];
    data: number[][];
}

/**
 * Class to represent data of a Distribution
 */
class Distribution {
    public rows: string[];
    public columns: string[];
    public data: number[][];

    /**
     *
     * @param distributionProps Raw data of distribution
     */
    constructor(distributionProps: DistributionData) {
        this.rows = distributionProps.rows;
        this.columns = distributionProps.columns;
        this.data = distributionProps.data;
    }

    /**
     * Calculates degrees of freedom of the data
     *
     * @return number
     */
    public degreesOfFreedom(): number {
        const rows = this.rows.length;
        const columns = this.columns.length;
        return (rows - 1) * (columns - 1)
    }

    /**
     * Calculate the shape of the data
     *
     * @return number[]
     */
    public shape(): number[] {
        return [this.rows.length, this.columns.length];
    }

    /**
     * Calculate row marginals
     */
    public rowTotals(): { [key: string]: number } {
        const rowEntries = this.data.map((rowValues, i) => {
            return [this.rows[i], rowValues.reduce(add, 0)];
        })

        return Object.fromEntries(rowEntries)
    }

    /**
     * Calculate column marginals
     */
    public columnTotals(): { [key: string]: number } {
        const columnEntries = this.columns.map((column, i) => {
            return [column, this.data.map(values => values[i]).reduce(add, 0)]
        })

        return Object.fromEntries(columnEntries);
    }

    /**
     * Calculate total entries
     */
    public total(): number {
        return this.data.reduce((prev, current) => {
            return prev + current.reduce(add, 0)
        }, 0);
    }
}

export type {DistributionData};
export {Distribution};
