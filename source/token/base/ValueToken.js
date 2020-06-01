//requires: interface/IToken.js
class ValueToken {
    constructor(value) {
        this._value = value;
    }
    GetValueAsync(context) {
        return new Promise(resolve => resolve(this._value));
    }
}
