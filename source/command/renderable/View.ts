//requires: renderable/RenderableBase.js
class View extends RenderableBase {
    readonly GroupColumn: IToken<string>;

    constructor(element: Element) {
        super(element);
        this.GroupColumn = element.GetStringToken('groupcol');
    }

    async RenderAsync(dataSource: IDataSource, context: IContext, faces: FaceCollection, replaces: ReplaceCollection, dividerRowcount: number, dividerTemplate: string, incompleteTemplate: string): Promise<string> {
        
            var retVal = '';
        if (dataSource.Data.Rows.length != 0) {
            var groupColumn = await Util.GetValueOrSystemDefaultAsync(this.GroupColumn, context, "ViewCommand.GroupColumn");

                var groupList = <any[]>alasql(`SELECT DISTINCT ${groupColumn} FROM ?`, [dataSource.Data.Rows])
                var rootRenderParam = new RenderParam(
                    replaces,
                    groupList.length,
                    dividerRowcount,
                    dividerTemplate,
                    incompleteTemplate);
                rootRenderParam.SetLevel(["1"]);

                groupList.forEach((group, _i, _) => {
                    var childItems = <any[]>alasql(`SELECT * FROM ? where ${groupColumn} = ?`, [dataSource.Data.Rows, group[groupColumn]])
                    rootRenderParam.Data = childItems[0];
                    var level1Result: string = faces.Render(rootRenderParam, context);
                    var level2Result = '';
                    var childRenderParam = new RenderParam(
                        replaces,
                        childItems.length,
                        dividerRowcount,
                        dividerTemplate,
                        incompleteTemplate);
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
        };
        return retVal;
    }
}

