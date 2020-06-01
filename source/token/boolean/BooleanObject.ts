//requires: token/base/ObjectToken.js
class BooleanObject extends ObjectToken<boolean> {
    constructor(rawValue: string) {
        super(rawValue);
    }
    TryParse(value: string): boolean {
        return Util.HasValue(value) ? value.toLowerCase() == 'true' : false;
    }
}
