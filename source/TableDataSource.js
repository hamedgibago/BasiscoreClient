class TableDataSource {
    constructor(table) {
        this.Type = DataSourceType.Table;
        this.Data = table;
        this.Id = table.Name;
    }
}
