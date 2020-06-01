
class TableDataSource implements IDataSource {
    readonly Type: DataSourceType;
    readonly Data: DataTable;
    readonly Id: string;

    constructor(table: DataTable) {
        this.Type = DataSourceType.Table;
        this.Data = table;
        this.Id = table.Name;
    }
}
