var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//requires: interface/IToken.js
class ObjectToken {
    constructor(rawValue) {
        this.Params = rawValue.split('|').map(part => {
            var parts = part.toLowerCase().split('.');
            var retVal = new SimpleTokenElement();
            retVal.Column = parts.slice(2).join('.');
            retVal.DataMember = parts.slice(0, 2).join('.');
            return retVal;
        });
    }
    GetValueAsync(context) {
        return __awaiter(this, void 0, void 0, function* () {
            var retVal;
            for (var i = 0; i < this.Params.length; i++) {
                var item = this.Params[i];
                var isLastItem = (i + 1 == this.Params.length);
                if (item.DataMember.startsWith('(')) {
                    retVal = this.TryParse(item.DataMember.substr(1, item.DataMember.length - 2));
                }
                else {
                    var dataSource = context.TryGetDataSource(item.DataMember);
                    if (dataSource == null) {
                        if (isLastItem) {
                            if (item.DataMember.toLowerCase().startsWith("cms.")) {
                                break;
                            }
                            dataSource = yield context.WaitToGetDataSourceAsync(item.DataMember);
                        }
                        else {
                            continue;
                        }
                    }
                    var columnName = item.Column || dataSource.Data.Columns[1];
                    columnName = columnName.toLowerCase();
                    if (dataSource.Data.Columns.indexOf(columnName) == -1) {
                        if (isLastItem) {
                            break;
                        }
                        else {
                            continue;
                        }
                    }
                    if (dataSource.Data.Rows.length == 1) {
                        var columnRawValue = dataSource.Data.Rows[0][columnName];
                        var columnValue = '';
                        try {
                            columnValue = columnRawValue.toString();
                        }
                        catch ( /*Nothing*/_a) { /*Nothing*/ }
                        if (!Util.HasValue(columnRawValue) || columnValue === '') {
                            //if value in source is null or blank,process next source
                            if (!isLastItem) {
                                continue;
                            }
                        }
                        else {
                            retVal = this.TryParse(columnValue);
                            break;
                        }
                    }
                    else if (dataSource.Data.Rows.length > 1) {
                        try {
                            var sb = "";
                            var data = dataSource.Data.Rows.filter(x => Util.HasValue(x[columnName])).map(x => x[columnName]);
                            var isString = typeof (data[0]) == 'string';
                            data.forEach(item => {
                                if (sb.length > 0) {
                                    sb += ",";
                                }
                                sb += isString ? `'${item}'` : (item);
                            });
                            retVal = this.TryParse(sb);
                            break;
                        }
                        catch ( /*Nothing*/_b) { /*Nothing*/ }
                    }
                }
            }
            return retVal;
        });
    }
}
