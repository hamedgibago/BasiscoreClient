/*
require
    command/Command.js
*/
class Call extends CommandBase {
    FileName: IToken<string>;
    PageSize: IToken<string>;

    constructor(element: Element) {
        super(element);
        this.FileName = element.GetStringToken('file');
        this.PageSize = element.GetStringToken('pagesize');
    }

    async ExecuteCommandAsync(context: IContext): Promise<ICommandResult> {
        var filename = await Util.GetValueOrDefaultAsync(this.FileName, context, null);
        var pagesize = await Util.GetValueOrDefaultAsync(this.PageSize, context, null);
        var commnad = await Util.GetValueOrDefaultAsync(this.Element.outerHTML.ToStringToken(), context);
        var result = await context.LoadPageAsync(
            filename,
            commnad,
            pagesize,
            0
        );
        this.Element.outerHTML = result;
        return new VoidResult();
    }
}

