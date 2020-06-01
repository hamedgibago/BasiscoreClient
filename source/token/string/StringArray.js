//requires: token/base/ArrayToken.js
class StringArray extends ArrayToken {
    TryParse(value) {
        return value;
    }
    constructor(...collection) {
        super(...collection);
    }
}
