//https://javascript.info/regexp-groups
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
interface ICommand {
    ExecuteAsync(context: IContext): Promise<ICommandResult>;
}

