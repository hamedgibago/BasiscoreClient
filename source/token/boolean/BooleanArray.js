//requires: token/base/ArrayToken.js
class BooleanArray extends ArrayToken {
    TryParse(value) {
        return Util.HasValue(value) ? value.toLowerCase() == 'true' : false;
    }
    constructor(...collection) {
        super(...collection);
    }
}
