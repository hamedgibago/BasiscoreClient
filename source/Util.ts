//https://github.com/agershun/alasql
declare var alasql: any;
class Util {

    static ReplaceEx(source: string, searchValue: string, replaceValue: string): string {
        return source.replace(new RegExp(searchValue, 'gi'), replaceValue);
    }


    static ApplayFilter(source: DataTable, filter: string): any[] {
        return (filter == null || filter == '') ? source.Rows : alasql(`SELECT * FROM ? where ${filter}`, [source.Rows]);
    }

    static ApplySort(source: DataTable, sort: string): DataTable {
        var retVal = source;
        if (sort) {
            retVal = new DataTable(source.Name, source.Columns);
            retVal.Rows = alasql(`SELECT * FROM ? order by ${sort}`, [source.Rows]);
        }
        return retVal;
    }
    static ApplySql(source: DataTable, sql: string): DataTable {
        var retVal = source;
        if (sql) {
            retVal = new DataTable(source.Name, source.Columns);
            retVal.Rows = alasql(Util.ReplaceEx(sql, `\\[${source.Name}\\]`, '?'), [source.Rows]);
        }
        return retVal;
    }
    static AddToContext(datatable: DataTable, context: IContext, preview: boolean = false, sort: string = null, postSql: string = null) {
        Util.AddRowNumber(datatable);
        if (postSql) {
            datatable = Util.ApplySql(datatable, postSql);
            datatable.UpdateColumnList();
        }
        if (sort) {
            datatable = Util.ApplySort(datatable, sort);
            datatable.UpdateColumnList();
        }

        var source = new TableDataSource(datatable);
        context.AddDataSource(source);
        if (preview || context.DebugContext.InDebugMode) {
            context.AddPreview(source);
        }
    }

    static AddRowNumber(datatable: DataTable) {
        var index = 1;
        datatable.Rows.forEach(row => {
            row.rownumber = index++;
        })
        datatable.UpdateColumnList();
    }

    static Equal(a: any, b: any): boolean {
        var retVal: boolean = true;
        if (!Util.HasValue(a) || !Util.HasValue(b)) {
            retVal = false;
        } else {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            if (aProps.length != bProps.length) {
                retVal = false;
            } else {
                for (var i = 0; i < aProps.length; i++) {
                    var propName = aProps[i];
                    if (a[propName] !== b[propName]) {
                        retVal = false;
                        break;
                    }
                }
            }
        }
        return retVal;
    }

    static ToDataSet(json: string): DataSet {
        var obj: { [key: string]: any[] } = JSON.parse(json);
        var retVal = new DataSet();
        Object.getOwnPropertyNames(obj).forEach((tblName, _i, _) => {
            var rawTbl: any[] = obj[tblName];
            var tbl: DataTable = Util.ToDataTable(rawTbl, tblName);
            retVal.Tabels[tblName] = tbl;
        })
        return retVal;
    }
    static ToDataTable(rawTbl: Array<any>, tblName): DataTable {
        var cols = <string[]>rawTbl.shift();
        //for add case insensitive to alasql lib
        cols = cols.map(x => x.toLowerCase().trim());
        var retVal: DataTable = new DataTable(tblName, cols);


        rawTbl.forEach((rawRow, __i, __) => {
            var row = {};
            cols.forEach((col, _ii, __) => {
                row[col] = rawRow[_ii];
            });
            retVal.Rows.push(row);
        })
        return retVal;
    }

    static async  GetValueOrDefaultAsync<T>(token: IToken<T>, context: IContext, defaultValue: T = null): Promise<T> {
        return await token?.GetValueAsync(context) || defaultValue;
    }


    static async GetValueOrSystemDefaultAsync<T>(token: IToken<string>, context: IContext, key: string): Promise<string> {
        var retVal: string;
        if (Util.HasValue(token)) {
            retVal = await token.GetValueAsync(context);
        } else {
            retVal = context.GetDefault(key);
        }
        return retVal;
    }

    static IsEqual(stringA: string, stringB: string): boolean {
        return (stringA || '').IsEqual(stringB);
    }



    static HasValue(data: any): boolean {
        return (data !== undefined && data != null);
    }



    static ToStringToken(data: string): IToken<string> {
        return Util.ToToken<string>(
            data,
            x => new StringValue(x),
            x => new StringObject(x),
            (...x) => new StringArray(...x));
    }
    static ToIntegerToken(data: string): IToken<number> {
        return Util.ToToken<number>(
            data,
            x => new IntegerValue(parseInt(x)),
            x => new IntegerObject(x),
            (...x) => new IntegerArray(...x));
    }
    static ToBooleanToken(data: string): IToken<boolean> {
        return Util.ToToken<boolean>(
            data,
            x => new BooleanValue(Util.IsEqual(x, 'true')),
            x => new BooleanObject(x),
            (...x) => new BooleanArray(...x));
    }

    static ToToken<T>(data: string,
        newValueToken: { (data: string): ValueToken<T> },
        newObjectToken: { (data: string): ObjectToken<T> },
        newArrayToken: { (...data: IToken<string>[]): ArrayToken<T> }): IToken<T> {
        //https://javascript.info/regexp-methods
        var tmp = RequestContext.Current.GetDefault('binding.regex', '\\[##([^#]*)##\\]')
        var retVal: IToken<T>;
        if (Util.HasValue(data)) {
            var match = data.match(tmp);
            if (!match) {
                retVal = newValueToken(data);
            } else {
                var list = new Array<any>();
                do {
                    if (match.index != 0) {
                        list.push(newValueToken(match.input.substring(0, match.index)));
                    }
                    list.push(newObjectToken(match[1]));
                    data = data.substring(match.index + match[0].length);
                    match = data.match(tmp);
                } while (match)
                if (data.length > 0) {
                    list.push(newValueToken(data));
                }
                if (list.length == 1) {
                    retVal = list[0];
                } else {
                    retVal = newArrayToken(...list);
                }
            }
        }
        return retVal;
    }


    public static FindElementRootCommandNode(rootElement: Element): Array<Element> {
        var retVal: Array<Element> = [];
        var prodcess = (child: ChildNode) => {
            if (child instanceof Element && (<Element>child).IsBasisCore()) {
                retVal.push(<any>child);
            } else {
                child.childNodes.forEach(prodcess);
            }
        }
        rootElement.childNodes.forEach(prodcess);
        return retVal;
    }
}
