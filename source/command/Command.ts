/*
 require
    command/CommandBase.js
 */
abstract class Command extends CommandBase {
    readonly DataSourceId: IToken<string>;
    constructor(element: Element) {
        super(element);
        this.DataSourceId = element.GetStringToken('datamembername');
    }
    async ExecuteCommandAsync(context: IContext): Promise<ICommandResult> {
            var dataSourceId = await Util.GetValueOrDefaultAsync(this.DataSourceId, context, null);
            var source: IDataSource = null;
            if (dataSourceId) {
                source = await context.WaitToGetDataSourceAsync(dataSourceId);
            }
            return await this.ExecuteAsyncEx(source, context);
        
    }
    abstract ExecuteAsyncEx(dataSource: IDataSource, context: IContext): Promise<ICommandResult>;

    public static ToCommand(element: Element): ICommand {
        return Convertor.ToCommand(element);
    }
}