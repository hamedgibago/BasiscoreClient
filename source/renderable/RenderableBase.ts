//requires: command/Command.js
abstract class RenderableBase extends Command {
    constructor(element: Element) {
        super(element);
        this.Layout = element.querySelector('layout')?.GetTemplateToken();
        this.ElseLayout = element.querySelector('else-layout')?.GetTemplateToken();
        this.IncompleteTemplate = element.querySelector('incomplete')?.GetTemplateToken();
        var devider = element.querySelector('divider');
        this.DividerTemplate = devider?.GetTemplateToken();
        this.DividerRowcount = devider?.GetIntegerToken("rowcount");
        this.RawReplaces = RawReplaceCollection.Create(element);
        this.RawFaces = RawFaceCollection.Create(element);
    }
    readonly DividerTemplate: IToken<string>;
    readonly DividerRowcount: IToken<number>;
    readonly IncompleteTemplate: IToken<string>;
    readonly ElseLayout: IToken<string>;
    readonly Layout: IToken<string>;
    readonly RawFaces: RawFaceCollection;
    readonly RawReplaces: RawReplaceCollection;


    async ExecuteAsyncEx(dataSource: IDataSource, context: IContext): Promise<ICommandResult> {

        var faces = await  this.RawFaces.ProcessAsync(dataSource, context);
        var replaces = await this.RawReplaces.ProcessAsync(context);
        var dividerRowcount = await Util.GetValueOrDefaultAsync( this.DividerRowcount,context, 0);
        var dividerTemplate = await Util.GetValueOrDefaultAsync(this.DividerTemplate,context);
        var incompleteTemplate = await Util.GetValueOrDefaultAsync(this.IncompleteTemplate,context);
        var result = await this.RenderAsync(
            dataSource,
            context,
            faces,
            replaces,
            dividerRowcount,
            dividerTemplate,
            incompleteTemplate);

        if (Util.HasValue(result) && result.length > 0) {
            var layout = await Util.GetValueOrDefaultAsync(this.Layout, context, '@child');
            result = Util.ReplaceEx(layout,'@child', result);
        } else {
            result = await Util.GetValueOrDefaultAsync(this.ElseLayout, context, "");
        }
        this.Element.outerHTML = result;
        return new VoidResult();
    }

    RenderAsync(dataSource: IDataSource, context: IContext, faces: FaceCollection, replaces: ReplaceCollection, dividerRowcount: number, dividerTemplate: string, incompleteTemplate: string): Promise<string> {
        return new Promise(resolve => {
            var param = new RenderParam(
                replaces,
                dataSource.Data.Rows.length,
                dividerRowcount,
                dividerTemplate,
                incompleteTemplate);
            var result: string = "";
            dataSource.Data.Rows.forEach((row, _index, _) => {
                param.Data = row;
                result += faces.Render(param, context);
            });
            resolve(result);
        });

    }


}

