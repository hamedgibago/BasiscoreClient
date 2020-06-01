class DataTable {
    Name: string;
    Columns: Array<string>;
    Rows: Array<any>;
    constructor(name: string, columns: Array<string>) {
        this.Name = name;
        this.Columns = columns;
        this.Rows = new Array<any>();
    }

    public UpdateColumnList() {
        this.Columns = Object.getOwnPropertyNames(this.Rows[0]);
    }

}

