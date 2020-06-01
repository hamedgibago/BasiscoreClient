var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Util {
    static ReplaceEx(source, searchValue, replaceValue) {
        return source.replace(new RegExp(searchValue, 'gi'), replaceValue);
    }
    //static Format(format: string, object: any): string {
    //    var index = 0;
    //    for (var item in object) {
    //        format = Util.ReplaceEx(format, `(\\{${index}\\})`, object[item]); //format.replace(new RegExp(`(\\{${index}\\})`, 'gi'), object[item]);
    //        index++;
    //    }
    //    return format;
    //}
    static ApplayFilter(source, filter) {
        return (filter == null || filter == '') ? source.Rows : alasql(`SELECT * FROM ? where ${filter}`, [source.Rows]);
    }
    static ApplySort(source, sort) {
        var retVal = source;
        if (sort) {
            retVal = new DataTable(source.Name, source.Columns);
            retVal.Rows = alasql(`SELECT * FROM ? order by ${sort}`, [source.Rows]);
        }
        return retVal;
    }
    static ApplySql(source, sql) {
        var retVal = source;
        if (sql) {
            retVal = new DataTable(source.Name, source.Columns);
            retVal.Rows = alasql(Util.ReplaceEx(sql, `\\[${source.Name}\\]`, '?'), [source.Rows]);
        }
        return retVal;
    }
    static AddToContext(datatable, context, preview = false, sort = null, postSql = null) {
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
        if (preview || context.HostSetting.Debug) {
            context.AddPreview(source);
        }
    }
    static AddRowNumber(datatable) {
        var index = 1;
        datatable.Rows.forEach(row => {
            row.rownumber = index++;
        });
        datatable.UpdateColumnList();
    }
    static Equal(a, b) {
        var retVal = true;
        if (!Util.HasValue(a) || !Util.HasValue(b)) {
            retVal = false;
        }
        else {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            if (aProps.length != bProps.length) {
                retVal = false;
            }
            else {
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
    static ToDataSet(json) {
        var obj = JSON.parse(json);
        var retVal = new DataSet();
        Object.getOwnPropertyNames(obj).forEach((tblName, _i, _) => {
            var rawTbl = obj[tblName];
            var tbl = Util.ToDataTable(rawTbl, tblName);
            retVal.Tabels[tblName] = tbl;
        });
        return retVal;
    }
    static ToDataTable(rawTbl, tblName) {
        var cols = rawTbl.shift();
        //for add case insensitive to alasql lib
        cols = cols.map(x => x.toLowerCase().trim());
        var retVal = new DataTable(tblName, cols);
        rawTbl.forEach((rawRow, __i, __) => {
            var row = {};
            cols.forEach((col, _ii, __) => {
                row[col] = rawRow[_ii];
            });
            retVal.Rows.push(row);
        });
        return retVal;
    }
    static GetValueOrDefaultAsync(token, context, defaultValue = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (token === null || token === void 0 ? void 0 : token.GetValueAsync(context))) || defaultValue;
        });
    }
    static GetValueOrSystemDefaultAsync(token, context, key) {
        return __awaiter(this, void 0, void 0, function* () {
            var retVal;
            if (Util.HasValue(token)) {
                retVal = yield token.GetValueAsync(context);
            }
            else {
                retVal = context.GetDefault(key);
            }
            return retVal;
        });
    }
    static StringEqual(stringA, stringB) {
        return (stringA || '').localeCompare(stringB || '', undefined, { sensitivity: 'accent' }) == 0;
    }
    static HasValue(data) {
        return (data !== undefined && data != null);
    }
    static ToStringToken(data) {
        return Util.ToToken(data, x => new StringValue(x), x => new StringObject(x), (...x) => new StringArray(...x));
    }
    static ToIntegerToken(data) {
        return Util.ToToken(data, x => new IntegerValue(parseInt(x)), x => new IntegerObject(x), (...x) => new IntegerArray(...x));
    }
    static ToBooleanToken(data) {
        return Util.ToToken(data, x => new BooleanValue(Util.StringEqual(x, 'true')), x => new BooleanObject(x), (...x) => new BooleanArray(...x));
    }
    //static  f(root: HTMLElement) {
    //    if (root.nodeType == Node.TEXT_NODE) {
    //          Util.t(root.textContent);
    //    } else {
    //        //if (!Util.StringEqual(root.tagName, 'basis'))
    //        {
    //            if (root.attributes.length > 0) {
    //                for (var index = 0; index < root.attributes.length; index++) {
    //                    Util.t(root.attributes[index].value);
    //                }
    //            }
    //            root.childNodes.forEach(x => Util.f(<any>x));
    //        }
    //    }
    //}
    static f(root) {
        return __awaiter(this, void 0, void 0, function* () {
            var checkContentForNotationAsync = (data) => {
                var token = data.ToStringToken();
                return (token instanceof StringObject || token instanceof StringArray) ? token : null;
            };
            if (root.nodeType == Node.TEXT_NODE) {
                var token = yield checkContentForNotationAsync(root.textContent);
                if (token) {
                    root.textContent = yield Util.GetValueOrDefaultAsync(token, Context.Current);
                }
            }
            else {
                for (var index = 0; index < root.attributes.length; index++) {
                    token = yield checkContentForNotationAsync(root.attributes[index].value);
                    if (token) {
                        root.attributes[index].value = yield Util.GetValueOrDefaultAsync(token, Context.Current);
                    }
                }
                root.childNodes.forEach(x => Util.f(x));
            }
        });
    }
    //static t(data: string) {
    //    //https://javascript.info/regexp-methods
    //    if (data) {
    //        data = data.trim();
    //        if (data.length > 0 && data.includes('[##')) {
    //            data.match(/\[##([^#]*)##]/g).forEach(x => {
    //                console.log(data, x);
    //            });
    //            //console.log(`${data}`, data.match(r));
    //        }
    //    }
    //}
    //static async t(data: string) {
    //    var retVal = null;
    //    //https://javascript.info/regexp-methods
    //    var t = data.ToStringToken();
    //    if (t instanceof StringObject || t instanceof StringArray) {
    //        retVal = await t.GetValueAsync(Context.Current);
    //    }
    //    return retVal;
    //}
    static ToToken(data, newValueToken, newObjectToken, newArrayToken) {
        //https://javascript.info/regexp-methods
        var tmp = Context.GetSetting('default.binding.regex', '\\[##([^#]*)##\\]');
        //var regex = new RegExp(tmp);
        var retVal;
        if (Util.HasValue(data)) {
            var match = data.match(tmp);
            if (!match) {
                retVal = newValueToken(data);
            }
            else {
                var list = new Array();
                do {
                    if (match.index != 0) {
                        list.push(newValueToken(match.input.substring(0, match.index)));
                    }
                    list.push(newObjectToken(match[1]));
                    data = data.substring(match.index + match[0].length);
                    match = data.match(tmp);
                } while (match);
                if (data.length > 0) {
                    list.push(newValueToken(data));
                }
                if (list.length == 1) {
                    retVal = list[0];
                }
                else {
                    retVal = newArrayToken(...list);
                }
            }
        }
        return retVal;
    }
}
