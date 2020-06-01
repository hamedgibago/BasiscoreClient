var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//requires: renderable/RenderableBase.js
class Tree extends RenderableBase {
    constructor(element) {
        super(element);
        this.NullValue = element.GetStringToken('nullvalue');
        this.RelationColumnName = element.GetStringToken('relationnamecol');
        this.ForeignKey = element.GetStringToken('parentidcol');
        this.PrincipalKey = element.GetStringToken('idcol');
    }
    RenderAsync(dataSource, context, faces, replaces, dividerRowcount, dividerTemplate, incompleteTemplate) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            var retVal = '';
            if (dataSource.Data.Rows.length != 0) {
                var relationColumnName = yield ((_a = this.RelationColumnName) === null || _a === void 0 ? void 0 : _a.GetValueAsync(context));
                var foreignKey = (yield ((_b = this.ForeignKey) === null || _b === void 0 ? void 0 : _b.GetValueAsync(context))) || "parentid";
                var principalKey = (yield ((_c = this.PrincipalKey) === null || _c === void 0 ? void 0 : _c.GetValueAsync(context))) || "id";
                var nullValue = (yield ((_d = this.NullValue) === null || _d === void 0 ? void 0 : _d.GetValueAsync(context))) || "0";
                var rootRecord = alasql(`SELECT * FROM ? WHERE ${foreignKey} ${(Util.StringEqual(nullValue, 'null') ? 'is' : '=')} ${nullValue}`, [dataSource.Data.Rows]);
                if (rootRecord.length == 0) {
                    throw new Error(`Tree Command Has No Root Record In Data Member '${dataSource.Id}' With '${nullValue}' Value In '${foreignKey}' Column That Set In NullValue Attribute.`);
                }
                var rootRenderParam = new RenderParam(replaces, rootRecord.length, dividerRowcount, dividerTemplate, incompleteTemplate);
                rootRecord.forEach(row => {
                    rootRenderParam.Data = row;
                    retVal += this.RenderLevel(dataSource, rootRenderParam, 1, faces, replaces, context, dividerRowcount, dividerTemplate, incompleteTemplate, principalKey, foreignKey);
                });
            }
            ;
            return retVal;
        });
    }
    RenderLevel(dataSource, parentRenderParam, level, faces, replaces, context, dividerRowcount, dividerTemplate, incompleteTemplate, principalKey, foreignKey) {
        var retVal = "";
        var childRenderResult = "";
        var childRows = alasql(`SELECT * FROM ? WHERE ${foreignKey} = ?`, [dataSource.Data.Rows, parentRenderParam.Data[principalKey]]);
        var groups = {};
        if (childRows.length != 0) {
            var newLevel = level + 1;
            var childRenderParam = new RenderParam(replaces, childRows.length, dividerRowcount, dividerTemplate, incompleteTemplate);
            if (!this.RelationColumnName) {
                childRows.forEach(row => {
                    childRenderParam.Data = row;
                    childRenderResult += this.RenderLevel(dataSource, childRenderParam, newLevel, faces, replaces, context, dividerRowcount, dividerTemplate, incompleteTemplate, principalKey, foreignKey);
                });
                groups[""] = childRenderResult;
            }
            else {
                throw new Error(`RelationColumnName Not Implemented`);
            }
            parentRenderParam.SetLevel([`${level}`]);
        }
        else {
            groups[""] = "";
            parentRenderParam.SetLevel([`${level}`, 'end']);
        }
        retVal = faces.Render(parentRenderParam, context);
        if (retVal) {
            Object.getOwnPropertyNames(groups).forEach(key => retVal = retVal.replace(`@child${key ? `(${key})` : ''}`, groups[key]));
        }
        return retVal;
    }
}
