//requires: token/base/ObjectToken.js
class StringObject extends ObjectToken<string> {
    constructor(rawValue: string) {
        super(rawValue);
    }
    TryParse(value: string): string {
        return value;
    }
}
