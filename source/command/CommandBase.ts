/*
 require
    interface\ICommand.js
*/
abstract class CommandBase implements ICommand {
    constructor(element: Element) {
        this.Core = element.getAttribute('core');
        this.Id = element.getAttribute('id');
        this.Name = element.GetStringToken('name');
        this.RunType = element.GetStringToken('run');
        this.If = element.GetStringToken('if');
        this.Element = element;
    }
    readonly Core: string;
    readonly Id: string;
    readonly Name: IToken<string>;
    readonly RunType: IToken<string>;
    readonly Element: Element;
    readonly If: IToken<string>;

    async ExecuteAsync(context: IContext): Promise<ICommandResult> {
        var retVal: ICommandResult = null;
        try {
            switch (await this.GetRunTypeValue(context)) {
                case RunType.atclient: {
                    if (await this.GetIfValue(context)) {
                        retVal = await this.ExecuteCommandAsync(context);
                    } else {
                        this.Element.outerHTML = "";
                        retVal = VoidResult.Result;
                    }
                }
            }
            return retVal;
        } catch (ex) {
            this.Element.outerHTML = ex;
            context.DebugContext.LogError(`Error In Run ${this.Core}`, ex);
        }
    }
    ExecuteCommandAsync(context: IContext): Promise<ICommandResult> {
        throw new Error("'ExecuteCommandAsync' Not Implemented");
    }
    async GetIfValue(context: IContext): Promise<boolean> {
        var value = await Util.GetValueOrDefaultAsync(this.If, context, null);
        return value?.Evaluating() ?? true;
    }
    async GetRunTypeValue(context: IContext): Promise<RunType> {
        var value = await Util.GetValueOrDefaultAsync(this.RunType, context, "atclient");
        return RunType[value.toLowerCase()];
    }
}
