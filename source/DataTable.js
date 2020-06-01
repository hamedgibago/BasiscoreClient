class DataTable {
    constructor(name, columns) {
        this.Name = name;
        this.Columns = columns;
        this.Rows = new Array();
    }
    UpdateColumnList() {
        this.Columns = Object.getOwnPropertyNames(this.Rows[0]);
    }
}
