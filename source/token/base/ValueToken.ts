//requires: interface/IToken.js
abstract class ValueToken<T> implements IToken<T>{
    readonly _value: T;
    constructor(value: T) {
        this._value = value;
    }
    GetValueAsync(context: IContext): Promise<T> {
        return new Promise(resolve => resolve(this._value));
    }
}