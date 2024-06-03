import {add, and, or} from "../util/reducerFunctions";

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

        this.validate();
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
     * @return number[] - Array with dimensions of data array
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

    /**
     * Validates that the data is in a valid state.
     * All values have to be >= 0.
     * The number of rows should equal the number of entries in the data.
     * The number of columns should equal the number of entries within each data row.
     * There should be at least one row and column.
     */
    private validate() {
        const valuesGreaterZero = this.data.map(row => {
            return row.map(value => value >= 0).reduce(and, true)
        }).reduce(and, true);

        if (!valuesGreaterZero) {
            throw Error("Unexpected values in data. Check if all submitted values are greater or equal to 0.");
        }

        const rowCountMatches = this.rows.length === this.data.length;

        if (!rowCountMatches) {
            throw Error("Unexpected values in data. Check if submitted rows equal the number of rows in your data.");
        }

        const columnCountMatches = this.data.map(row => row.length === this.columns.length).reduce(and, true);

        if (!columnCountMatches) {
            throw Error("Unexpected values in data. Check if submitted columns equal the number of columns in your data. Also check if all your rows are equal in size.");
        }

        const dataProvided = this.rows.length > 0 && this.columns.length > 0;

        if (!dataProvided) {
            throw Error("Unexpected values in data. Check if you submitted any data.");
        }
    }
}

export type {DistributionData};
export {Distribution};
