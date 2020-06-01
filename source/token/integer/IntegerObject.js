//requires: token/base/ObjectToken.js
class IntegerObject extends ObjectToken {
    constructor(rawValue) {
        super(rawValue);
    }
    TryParse(value) {
        try {
            return parseInt(value);
        }
        catch ( /*Nothing*/_a) { /*Nothing*/ }
        return 0;
    }
}
