//requires: interface/IContext.js
interface IToken<T> {
    GetValueAsync(context: IContext): Promise<T>;
}
