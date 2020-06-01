//requires: token/base/ArrayToken.js
class BooleanArray extends ArrayToken<boolean> {
    TryParse(value: string): boolean {
        return Util.HasValue(value) ? value.toLowerCase() == 'true' : false;
    }
    constructor(...collection: Array<IToken<string>>) {
        super(...collection);
    }
}
