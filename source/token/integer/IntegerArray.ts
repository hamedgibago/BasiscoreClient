//requires: token/base/ArrayToken.js
class IntegerArray extends ArrayToken<number> {
    TryParse(value: string): number {
        try {
            return parseInt(value);
        }
        catch { /*Nothing*/ }
        return 0;
    }
    constructor(...collection: Array<IToken<string>>) {
        super(...collection);
    }
}
