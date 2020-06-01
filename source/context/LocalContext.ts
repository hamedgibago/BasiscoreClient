/*require
 context/Context.js
 */
class LocalContext extends Context {
    async CheckSourceHeartbeatAsync(source: string): Promise<boolean> {
       return await this.Owner.CheckSourceHeartbeatAsync(source);
    }
    readonly Resolves: IDictionary<OnResolveDataSource[]> = {};
    OnDataSourceAdded: Array<OnResolveDataSource> = [];

    AddPreview(source: IDataSource): void {
        this.Owner.AddPreview(source);
    }

    async LoadDataAsync(sourceName: string, connectionName: string, parameters: IDictionary<string>): Promise<DataSet> {
        return await this.Owner.LoadDataAsync(sourceName, connectionName, parameters);
    }
    async LoadPageAsync(pageName: string, rawCommand: string, pageSize: string, callDepth: number): Promise<string> {
        return await this.Owner.LoadPageAsync(pageName, rawCommand, pageSize, callDepth);
    }
    readonly Owner: IContext;
    constructor(owner: IContext) {
        super(owner.DebugContext);
        this.Owner = owner;
        if (owner instanceof LocalContext) {
            var localContextOwner = <LocalContext>this.Owner;
            localContextOwner.OnDataSourceAdded.push(x=>this.OnDataSourceAddedHandler(x));
        }
    }
    private OnDataSourceAddedHandler(source: IDataSource) {
        this.Resolves[source.Id]?.forEach(fn => fn(source));
        delete this.Resolves[source.Id];
        this.OnDataSourceAdded.forEach(fn => fn(source));
    }
    GetDefault(key: string): string
    GetDefault(key: string, defaultValue: string): string;
    GetDefault(key: any, defaultValue?: any): string {
        return this.Owner.GetDefault(key, defaultValue);
    }
    TryGetDataSource(dataSourceId: string): IDataSource {
        return this.Repository[dataSourceId] ?? this.Owner.TryGetDataSource(dataSourceId);
    }

    WaitToGetDataSourceAsync(dataSourceId: string): Promise<IDataSource> {
        return new Promise((resolve, reject) => {
            var retVal = this.TryGetDataSource(dataSourceId);
            if (retVal) {
                resolve(retVal);
            } else {
                this.DebugContext.LogInformation(`wait for ${dataSourceId}`);
                var tmp = this.Resolves[dataSourceId];
                if (!tmp) {
                    tmp = [];
                    this.Resolves[dataSourceId] = tmp;
                }
                tmp.push(resolve);
            }
        });
    }
    AddDataSource(source: IDataSource): void {
        super.AddDataSource(source);
        this.OnDataSourceAddedHandler(source);
    }
}