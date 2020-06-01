class UnknownCommand extends Command {
    constructor(element: Element) {
        super(element);
    }
    ExecuteAsyncEx(dataSource: IDataSource, context: IContext): Promise<ICommandResult> {
        return null;
    }
}
