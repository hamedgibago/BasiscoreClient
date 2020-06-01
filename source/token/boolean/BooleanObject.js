//requires: token/base/ObjectToken.js
class BooleanObject extends ObjectToken {
    constructor(rawValue) {
        super(rawValue);
    }
    TryParse(value) {
        return Util.HasValue(value) ? value.toLowerCase() == 'true' : false;
    }
}
