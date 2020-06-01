/*
require
    command/Command.js
*/
class Group extends CommandBase {
    FileName: IToken<string>;
    PageSize: IToken<string>;

    Commands: Array<ICommand> = [];

    constructor(element: Element) {
        super(element);
    }

    async ExecuteCommandAsync(context: IContext): Promise<ICommandResult> {

        var tasks = Array<Promise<ICommandResult>>();
        var localContext = new LocalContext(context);
        await this.ProcessCallAsync(localContext);
        Util.FindElementRootCommandNode(this.Element)
            .map(x => Command.ToCommand(x))
            .forEach(command => tasks.push(command.ExecuteAsync(localContext)));
        await Promise.all(tasks);
        await this.ReplaceNotationAsync(this.Element, localContext);
        if (Util.IsEqual(this.Core, 'group')) {
            this.Element.outerHTML = this.Element.innerHTML;
        }
        return new VoidResult();
    }

    private async ProcessCallAsync(context: IContext): Promise<void> {
        var calls = Util.FindElementRootCommandNode(this.Element).filter(x => Util.IsEqual(x.getAttribute('core'), 'call'));
        while (calls.length > 0) {
            var commands: Array<ICommand> = [];
            calls.forEach(element => commands.push(Command.ToCommand(element)));
            var tasks = Array<Promise<ICommandResult>>();
            commands.forEach(command => tasks.push(command.ExecuteAsync(context)));
            await Promise.all(tasks);
            calls = Util.FindElementRootCommandNode(this.Element).filter(x => Util.IsEqual(x.getAttribute('core'), 'call'));
        }
    }

    private async ReplaceNotationAsync(root: Element, context: IContext) {
        if (root.nodeType == Node.TEXT_NODE) {
            var token = await this.CheckContentForNotationAsync(root.textContent);
            if (token) {
                root.textContent = await Util.GetValueOrDefaultAsync(token, context);
            }
        } else {
            for (var index = 0; index < root.attributes.length; index++) {
                token = await this.CheckContentForNotationAsync(root.attributes[index].value);
                if (token) {
                    root.attributes[index].value = await Util.GetValueOrDefaultAsync(token, context);
                }
            }
            root.childNodes.forEach(x => {
                if (!(x instanceof Element) || !(<Element>x).IsBasisCore()) {
                    this.ReplaceNotationAsync(<Element>x, context);
                }
            });
        }
    }

    private CheckContentForNotationAsync(data: string): IToken<string> {
        var token = data.ToStringToken();
        return (token instanceof StringObject || token instanceof StringArray) ? token : null;
    };
}

