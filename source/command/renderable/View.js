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
class View extends RenderableBase {
    constructor(element) {
        super(element);
        this.GroupColumn = element.GetStringToken('groupcol'); // ?? 'prpid';
    }
    RenderAsync(dataSource, context, faces, replaces, dividerRowcount, dividerTemplate, incompleteTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            var retVal = '';
            if (dataSource.Data.Rows.length != 0) {
                var groupColumn = yield Util.GetValueOrSystemDefaultAsync(this.GroupColumn, context, "ViewCommand.GroupColumn");
                var groupList = alasql(`SELECT DISTINCT ${groupColumn} FROM ?`, [dataSource.Data.Rows]);
                var rootRenderParam = new RenderParam(replaces, groupList.length, dividerRowcount, dividerTemplate, incompleteTemplate);
                rootRenderParam.SetLevel(["1"]);
                groupList.forEach((group, _i, _) => {
                    var childItems = alasql(`SELECT * FROM ? where ${groupColumn} = ?`, [dataSource.Data.Rows, group[groupColumn]]);
                    rootRenderParam.Data = childItems[0];
                    var level1Result = faces.Render(rootRenderParam, context);
                    var level2Result = '';
                    var childRenderParam = new RenderParam(replaces, childItems.length, dividerRowcount, dividerTemplate, incompleteTemplate);
                    childRenderParam.SetLevel(["2"]);
                    childItems.forEach((row, _i, _) => {
                        childRenderParam.Data = row;
                        var renderResult = faces.Render(childRenderParam, context);
                        if (renderResult) {
                            level2Result += renderResult;
                        }
                    });
                    retVal += level1Result.replace('@child', level2Result);
                });
            }
            ;
            return retVal;
        });
    }
}
