//requires: token/base/ObjectToken.js
class StringObject extends ObjectToken {
    constructor(rawValue) {
        super(rawValue);
    }
    TryParse(value) {
        return value;
    }
}
