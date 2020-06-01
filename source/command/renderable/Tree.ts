//requires: renderable/RenderableBase.js
class Tree extends RenderableBase {
    readonly NullValue: IToken<string>;
    readonly RelationColumnName: IToken<string>;
    readonly ForeignKey: IToken<string>;
    readonly PrincipalKey: IToken<string>;

    constructor(element: Element) {
        super(element);
        this.NullValue = element.GetStringToken('nullvalue');
        this.RelationColumnName = element.GetStringToken('relationnamecol');
        this.ForeignKey = element.GetStringToken('parentidcol');
        this.PrincipalKey = element.GetStringToken('idcol')
    }

    async RenderAsync(dataSource: IDataSource, context: IContext, faces: FaceCollection, replaces: ReplaceCollection, dividerRowcount: number, dividerTemplate: string, incompleteTemplate: string): Promise<string> {
        var retVal = '';
        if (dataSource.Data.Rows.length != 0) {

            var foreignKey = await Util.GetValueOrDefaultAsync(this.ForeignKey, context, "parentid");
            var principalKey = await Util.GetValueOrDefaultAsync(this.PrincipalKey, context ,"id");
            var nullValue = await Util.GetValueOrDefaultAsync(this.NullValue, context, "0");


            var rootRecord = <any[]>alasql(`SELECT * FROM ? WHERE ${foreignKey} ${(Util.IsEqual(nullValue, 'null') ? 'is' : '=')
                } ${nullValue}`, [dataSource.Data.Rows])
            if (rootRecord.length == 0) {
                throw new Error(`Tree Command Has No Root Record In Data Member '${dataSource.Id}' With '${nullValue}' Value In '${foreignKey}' Column That Set In NullValue Attribute.`)
            }
            var rootRenderParam = new RenderParam(
                replaces,
                rootRecord.length,
                dividerRowcount,
                dividerTemplate,
                incompleteTemplate);
            rootRecord.forEach(row => {
                rootRenderParam.Data = row;
                retVal += this.RenderLevel(dataSource, rootRenderParam, 1, faces, replaces, context, dividerRowcount, dividerTemplate, incompleteTemplate, principalKey, foreignKey);
            });

        };
        return retVal;
    }

    RenderLevel(dataSource: IDataSource, parentRenderParam: RenderParam, level: number, faces: FaceCollection, replaces: ReplaceCollection, context: IContext, dividerRowcount: number, dividerTemplate: string, incompleteTemplate: string, principalKey: string, foreignKey: string): string {
        var retVal = "";
        var childRenderResult = "";
        var childRows = <any[]>alasql(`SELECT * FROM ? WHERE ${foreignKey} = ?`, [dataSource.Data.Rows, parentRenderParam.Data[principalKey]])
        var groups: { [key: string]: any } = {}
        if (childRows.length != 0) {
            var newLevel = level + 1;
            var childRenderParam = new RenderParam(
                replaces,
                childRows.length,
                dividerRowcount,
                dividerTemplate,
                incompleteTemplate);

            if (!this.RelationColumnName) {
                childRows.forEach(row => {
                    childRenderParam.Data = row;
                    childRenderResult += this.RenderLevel(dataSource, childRenderParam, newLevel, faces, replaces, context, dividerRowcount, dividerTemplate, incompleteTemplate, principalKey, foreignKey);
                })
                groups[""] = childRenderResult;
            } else {
                throw new Error(`RelationColumnName Not Implemented`);
            }
            parentRenderParam.SetLevel([`${level}`]);
        } else {
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
