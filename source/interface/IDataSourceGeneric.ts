/*require
DataTable.js
enum/DataSourceType.ts
 */
interface IDataSourceGeneric<T> extends IFetchable<T> {
    Type: DataSourceType;
    Data: DataTable;
}
