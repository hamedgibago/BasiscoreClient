var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Context {
    constructor() {
        this.Resolves = {};
        this.Repository = {};
        try {
            this.HostSetting = host;
        }
        catch (_a) {
            throw new Error("host object not found");
        }
    }
    static get Current() {
        if (Context._current == null) {
            //https://libraries.io/github/leebyron/alasql
            //https://github.com/agershun/alasql/wiki/Alasql-Options
            alasql.options.casesensitive = false;
            Context._current = new Context();
        }
        return Context._current;
    }
    LoadPageAsync(pageName, rawCommand, pageSize, callDepth) {
        var parameters = {
            'fileNames': pageName,
            'dmnid': this.GetDefault('dmnid', ''),
            'sitesize': pageSize,
            'command': rawCommand
        };
        return this.Ajax(`${this.GetDefault('connections.web.callcommand')}${pageName}`, this.GetDefault('call.verb', 'get'), parameters);
    }
    Ajax(url, methode, parameters) {
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
    static GetSetting(key, defaultValue) {
        var find = Object.getOwnPropertyNames(host.Settings).filter(x => Util.StringEqual(x, key));
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
    GetConnection(key) {
        return Context.GetSetting(`connection.${key}`, null);
    }
    GetDefault(key, defaultValue) {
        return Context.GetSetting(`default.${key}`, defaultValue);
    }
    AddPreview(source) {
        var str = "";
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
    RenderAsync() {
        return __awaiter(this, void 0, void 0, function* () {
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
                console.log(ex);
            }
            if (!rejected) {
                this.AddLocalDataAsDataSource();
                yield this.ProcessCallAsync();
                var elements = document.querySelectorAll('basis[run=atclient]');
                var commands = [];
                elements.forEach(element => commands.push(Command.ToCommand(element)));
                var tasks = Array();
                commands.forEach(command => tasks.push(command.ExecuteAsync(Context.Current)));
                yield Promise.all(tasks);
                try {
                    if (this.HostSetting.OnRendered) {
                        this.HostSetting.OnRendered();
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
                yield this.ReplaceDocumentNotationAsync(document.body);
            }
        });
    }
    ReplaceDocumentNotationAsync(root) {
        return __awaiter(this, void 0, void 0, function* () {
            var checkContentForNotationAsync = (data) => {
                var token = data.ToStringToken();
                return (token instanceof StringObject || token instanceof StringArray) ? token : null;
            };
            if (root.nodeType == Node.TEXT_NODE) {
                var token = yield checkContentForNotationAsync(root.textContent);
                if (token) {
                    root.textContent = yield Util.GetValueOrDefaultAsync(token, this);
                }
            }
            else {
                for (var index = 0; index < root.attributes.length; index++) {
                    token = yield checkContentForNotationAsync(root.attributes[index].value);
                    if (token) {
                        root.attributes[index].value = yield Util.GetValueOrDefaultAsync(token, this);
                    }
                }
                root.childNodes.forEach(x => Util.f(x));
            }
        });
    }
    ProcessCallAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            var elements = document.querySelectorAll('basis[core = call][run=atclient]');
            if (elements.length > 0) {
                while (elements.length > 0) {
                    var commands = [];
                    elements.forEach(element => commands.push(Command.ToCommand(element)));
                    var tasks = Array();
                    commands.forEach(command => {
                        tasks.push(command.ExecuteAsync(Context.Current));
                    });
                    yield Promise.all(tasks);
                    elements = document.querySelectorAll('basis[core = call][run=atclient]');
                }
                try {
                    if (this.HostSetting.OnCallExecuted) {
                        this.HostSetting.OnCallExecuted();
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
            }
        });
    }
    AddDataSource(source) {
        var _a;
        source.Id = source.Id.toLowerCase();
        source.Data.Name = source.Data.Name.toLowerCase();
        this.Repository[source.Id] = source;
        if (this.HostSetting.Debug) {
            console.log(`${source.Id} Added`);
        }
        (_a = this.Resolves[source.Id]) === null || _a === void 0 ? void 0 : _a.forEach((fn, _i, _) => fn(source));
        delete this.Resolves[source.Id];
    }
    TryGetDataSource(dataSourceId) {
        return this.Repository[dataSourceId];
    }
    LoadDataAsync(sourceName, connectionName, parameters) {
        return this.Ajax(this.GetConnection(`web.${connectionName}`), this.GetDefault('dbsource.verb', 'post'), parameters).then(x => Util.ToDataSet(x));
    }
    WaitToGetDataSourceAsync(dataSourceId) {
        return new Promise((resolve, reject) => {
            var retVal = this.TryGetDataSource(dataSourceId);
            if (retVal) {
                resolve(retVal);
            }
            else {
                if (this.HostSetting.Debug) {
                    console.log(`wait for ${dataSourceId}`);
                }
                var tmp = this.Resolves[dataSourceId];
                if (!tmp) {
                    tmp = [];
                    this.Resolves[dataSourceId] = tmp;
                }
                tmp.push(resolve);
            }
        });
    }
    AddLocalDataAsDataSource() {
        var cookieValues = document.cookie.split(';').map(x => x.split('='));
        var data = new Array();
        data.push(cookieValues.map(x => x[0]));
        data.push(cookieValues.map(x => x[1]));
        Util.AddToContext(Util.ToDataTable(data, 'cms.cookie'), this);
        var request = new Array();
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
        var cms = new Array();
        cms.push(['Date', 'Time', 'Date2', 'Time2', 'Date3']);
        cms.push([`${ye}/${mo}/${da}`, `${ho}:${mi}`, `${ye}${mo}${da}`, `${ho}${mi}${se}`, `${ye}.${mo}.${da}`]);
        Util.AddToContext(Util.ToDataTable(cms, 'cms.cms'), this);
        var query = window.location.search.substring(1);
        if (query.length > 0) {
            var querykeys = new Array();
            var queryValues = new Array();
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
}
