//requires: interface/IContext.js
declare var host: IHostSetting;
abstract class Context implements IContext {
    readonly DebugContext: IDebugContext;
    readonly Repository: IDictionary<IDataSource> = {}

    constructor(debugContext: IDebugContext) {
        this.DebugContext = debugContext;
    }

    abstract LoadPageAsync(pageName: string, rawCommand: string, pageSize: string, callDepth: number): Promise<string>;
    abstract GetDefault(key: string): string;
    abstract GetDefault(key: string, defaultValue: string): string;
    abstract GetDefault(key: any, defaultValue?: any): string
    abstract AddPreview(source: IDataSource): void;
    abstract LoadDataAsync(sourceName: string, connectionName: string, parameters: IDictionary<string>): Promise<DataSet>;
    abstract TryGetDataSource(dataSourceId: string): IDataSource;
    abstract WaitToGetDataSourceAsync(dataSourceId: string): Promise<IDataSource>;
    abstract CheckSourceHeartbeatAsync(source: string): Promise<boolean>;

    AddDataSource(source: IDataSource): void {
        source.Id = source.Id.toLowerCase();
        source.Data.Name = source.Data.Name.toLowerCase();
        this.Repository[source.Id] = source;
        this.DebugContext.LogInformation(`${source.Id} Added`);
    }
   


}


