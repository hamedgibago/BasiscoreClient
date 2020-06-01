/*require
 context/Context.js
 */
class RequestContext extends Context {

    HostSetting: IHostSetting;
    static _current: RequestContext;
    static get Current(): RequestContext {
        if (RequestContext._current == null) {
            //https://libraries.io/github/leebyron/alasql
            //https://github.com/agershun/alasql/wiki/Alasql-Options
            alasql.options.casesensitive = false;
            try {
                RequestContext._current = new RequestContext(new DebugContext(host));
            }
            catch {
                throw new Error("host object not found");
            }

        }
        return RequestContext._current;
    }
    private constructor(debugContext: IDebugContext) {
        super(debugContext);
        this.HostSetting = host;
    }
    async RenderAsync(): Promise<void> {
        var rejected = false;
        try {
            if (this.HostSetting.OnRendering) {
                var reason = this.HostSetting.OnRendering();
                if (reason) {
                    rejected = true;
                    throw new Error(reason);
                }
            }
        }
        catch (ex) {
            this.DebugContext.LogError('Error in Execute Host.OnRendering Method', ex);
        }
        if (!rejected) {
            this.AddLocalDataAsDataSource();
            var group: ICommand = new Group(document.body);
            await group.ExecuteAsync(this);
            try {
                if (this.HostSetting.OnRendered) {
                    this.HostSetting.OnRendered();
                }
            }
            catch (ex) {
                this.DebugContext.LogError('Error In Run Host.OnRendered Method', ex);
            }
        }
    }
    private AddLocalDataAsDataSource() {
        var cookieValues = document.cookie.split(';').map(x => x.split('='));
        var data = new Array<string[]>();
        data.push(cookieValues.map(x => x[0]));
        data.push(cookieValues.map(x => x[1]));
        Util.AddToContext(Util.ToDataTable(data, 'cms.cookie'), this);
        var request = new Array<string[]>();
        request.push(['requestId', 'hostip', 'hostport']);
        request.push(['-1', window.location.hostname, window.location.port]);
        Util.AddToContext(Util.ToDataTable(request, 'cms.request'), this);
        var toTwoDigit = x => ("0" + x).slice(-2);
        var d = new Date();
        var ye = d.getFullYear();
        var mo = toTwoDigit(d.getMonth());
        var da = toTwoDigit(d.getDay());
        var ho = toTwoDigit(d.getHours());
        var mi = toTwoDigit(d.getMinutes());
        var se = toTwoDigit(d.getSeconds());
        var cms = new Array<string[]>();
        cms.push(['Date', 'Time', 'Date2', 'Time2', 'Date3']);
        cms.push([`${ye}/${mo}/${da}`, `${ho}:${mi}`, `${ye}${mo}${da}`, `${ho}${mi}${se}`, `${ye}.${mo}.${da}`]);
        Util.AddToContext(Util.ToDataTable(cms, 'cms.cms'), this);
        var query = window.location.search.substring(1);
        if (query.length > 0) {
            var querykeys = new Array<string>();
            var queryValues = new Array<string>();
            query.split('&').forEach(x => {
                var pair = x.split('=');
                querykeys.push(pair[0]);
                queryValues.push(decodeURIComponent(pair[1] || ''));
            });
            Util.AddToContext(Util.ToDataTable([querykeys, queryValues], 'cms.query'), this);
        }
        if (this.HostSetting.Sources) {
            Object.getOwnPropertyNames(this.HostSetting.Sources).forEach(key => {
                Util.AddToContext(Util.ToDataTable(this.HostSetting.Sources[key], key.toLowerCase()), this);
            });
        }
    }
    LoadPageAsync(pageName: string, rawCommand: string, pageSize: string, callDepth: number): Promise<string> {
        var parameters: any = {
            'fileNames': pageName,
            'dmnid': this.GetDefault('dmnid', ''),
            'sitesize': pageSize,
            'command': rawCommand
        };
        return this.Ajax(`${this.GetDefault('connections.web.callcommand')}${pageName}`, this.GetDefault('call.verb', 'get'), parameters);
    }
    private Ajax(url: string, methode: string, parameters: IDictionary<string>): Promise<string> {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.open(methode, url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                    else {
                        reject(xhr.statusText);
                    }
                }
            };
            xhr.onerror = function (e) {
                reject(xhr.statusText);
            };
            var encodedDataPairs = [];
            ///https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started
            Object.getOwnPropertyNames(parameters).forEach((name, _i, _) => encodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(parameters[name])));
            xhr.send(encodedDataPairs.join('&').replace(/%20/g, '+'));
        });
    }
    LoadDataAsync(sourceName: string, connectionName: string, parameters: IDictionary<string>): Promise<DataSet> {
        return this.Ajax(this.GetConnection(`web.${connectionName}`), this.GetDefault('dbsource.verb', 'post'), parameters).then(x => Util.ToDataSet(x));
    }
    GetConnectionObject(source: string): any {
        return this.GetSetting(`connection.${source}`, null);
    }
    GetConnection(source: string): string {
        var retVal: string;
        var value = this.GetConnectionObject(source);
        if (typeof (value) === 'string') {
            retVal = value;
        } else {
            var setting = <IConnectionSetting>value;
            retVal = setting.Connection;
        }
        return retVal;
    }
    _checkedSourceHeartbeat: IDictionary<Promise<boolean>> = {};
    async CheckSourceHeartbeatAsync(source: string): Promise<boolean> {
        var retVal = this._checkedSourceHeartbeat[source];
        if (!Util.HasValue(retVal)) {
            var value = this.GetConnectionObject(`web.${source}`);
            if (typeof (value) === 'string') {
                retVal = Promise.resolve(true);
            } else {
                var setting = <IConnectionSetting>value;
                if (!Util.HasValue(setting.Heartbeat)) {
                    retVal = Promise.resolve(true);
                } else {
                    var f = async () => {
                        var tmp: boolean;
                        try {
                            await this.Ajax(setting.Heartbeat, 'get', {});
                            tmp= true;
                        } catch{
                            tmp= false;
                        };
                        this.DebugContext.LogInformation(`Checking '${source}' From '${setting.Heartbeat}' Is ${tmp}`);
                        return tmp;
                    };
                    retVal = f();
                }

                this._checkedSourceHeartbeat[source] = retVal;
            }
        }
        return await retVal;
    }
    GetSetting(key: string, defaultValue: string): any {
        var find = Object.getOwnPropertyNames(this.HostSetting.Settings).filter(x => Util.IsEqual(x, key));
        var retVal = find.length == 1 ? host.Settings[find[0]] : null;
        if (!retVal) {
            if (defaultValue) {
                retVal = defaultValue;
            }
            else {
                throw new ConfigNotFoundException("host.settings", key);
            }
        }
        return retVal;
    }
    GetDefault(key: string): string;
    GetDefault(key: string, defaultValue: string): string;
    GetDefault(key: any, defaultValue?: any): string {
        return this.GetSetting(`default.${key}`, defaultValue);
    }
    AddPreview(source: IDataSource): void {
        var str: string = "";
        source.Data.Rows.forEach(row => {
            str += "<tr>";
            Object.getOwnPropertyNames(row).forEach(col => {
                var value = row[col];
                str += `<td>${Util.HasValue(value) ? value : ''}</td>`;
            });
            str += "</tr>";
        });
        var columnNameList = "";
        var columnIndexList = "";
        source.Data.Columns.forEach((col, index) => {
            columnIndexList += `<td>col${index + 1}</td>`;
            columnNameList += `<td>${col}</td>`;
        });
        str = `<thead><tr><td colspan='${source.Data.Columns.length}'>${source.Id}</td></tr><tr>${columnIndexList}</tr><tr>${columnNameList}</tr></thead><tbody>${str}</tbody> `;
        var tbl = document.createElement("table");
        tbl.innerHTML = str;
        document.body.appendChild(tbl);
    }
    TryGetDataSource(dataSourceId: string): IDataSource {
        return this.Repository[dataSourceId];
    }
    WaitToGetDataSourceAsync(dataSourceId: string): Promise<IDataSource> {
        throw new Error(`Call WaitToGetDataSourceAsync In RequestContext For '${dataSourceId}'.No DataSource Add To this Context Dynamically.`);
    }
}
