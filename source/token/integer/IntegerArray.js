//requires: token/base/ArrayToken.js
class IntegerArray extends ArrayToken {
    TryParse(value) {
        try {
            return parseInt(value);
        }
        catch ( /*Nothing*/_a) { /*Nothing*/ }
        return 0;
    }
    constructor(...collection) {
        super(...collection);
    }
}
