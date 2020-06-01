//requires: interface/IHostSetting.js

interface IContext {
    LoadDataAsync(sourceName: string, connectionName: string, parameters: IDictionary<string>): Promise<DataSet>;
    WaitToGetDataSourceAsync(dataSourceId: string): Promise<IDataSource>;
    AddDataSource(source: IDataSource): void;
    TryGetDataSource(dataSourceId: string): IDataSource;
    AddPreview(source: IDataSource): void;
    LoadPageAsync(pageName: string, rawCommand: string, pageSize: string, callDepth: number): Promise<string>;
    CheckSourceHeartbeatAsync(source: string): Promise<boolean>;

    GetDefault(key: string): string;
    GetDefault(key: string, defaultValue: string): string;
    DebugContext: IDebugContext;
}
