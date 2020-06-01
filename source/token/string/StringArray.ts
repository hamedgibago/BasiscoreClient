//requires: token/base/ArrayToken.js
class StringArray extends ArrayToken<string> {
    TryParse(value: string): string {
        return value;
    }
    constructor(...collection: Array<IToken<string>>) {
        super(...collection);
    }
}
