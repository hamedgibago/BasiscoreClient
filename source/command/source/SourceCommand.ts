//requires: command/Command.js
abstract class SourceCommand<T extends Member> extends CommandBase {

    readonly ConnectionName: IToken<string>;
    readonly Members: Array<T>;


    constructor(element: Element, ctorCallback: {(element:Element):T}) {
        super(element);
        this.ConnectionName = element.GetStringToken('source');
        this.Members = new Array<T>();
        this.Element.querySelectorAll('member').forEach(elm => this.Members.push(ctorCallback(elm)));
    }

    async ExecuteCommandAsync(context: IContext): Promise<ICommandResult> {
        if ((this.Members?.length || 0) > 0) {
            var name = await Util.GetValueOrDefaultAsync(this.Name, context);
            var dataSet = await this.LoadDataAsync(name, context);
            var tables = Object.getOwnPropertyNames(dataSet.Tabels)
            if (this.Members.length != tables.length) {
                throw new Error(`Command '${name}' Has ${this.Members.length} Member(s) But ${tables.length} Result(s) Returned From Source!`);
            }
            this.Members.forEach(async (member, index) => {
                var source = dataSet.Tabels[tables[index]];
                await member.AddDataSourceAsync(source, name, context);
            });
        }
        this.Element.remove();
        return VoidResult.Result;
    }

    async LoadDataAsync(sourceName: string, context: IContext): Promise<DataSet> {
        var connectionName = await Util.GetValueOrDefaultAsync(this.ConnectionName, context);
        var commnad = this.Element.outerHTML.ToStringToken();
        var params: any = {
            'command': await Util.GetValueOrDefaultAsync(commnad, context),
            'dmnid': context.GetDefault('dmnid')
        };
        var name = await Util.GetValueOrDefaultAsync(this.Name, context, null);
        return await context.LoadDataAsync(sourceName, connectionName, params);

    }

}


