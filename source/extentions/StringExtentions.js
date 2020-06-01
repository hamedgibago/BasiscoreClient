Object.defineProperty(String.prototype, "Evaluating", {
    value: function Evaluating() {
        return this ? eval(this) : true;
    },
    writable: true,
    configurable: true
});
Object.defineProperty(String.prototype, "ToStringToken", {
    value: function ToStringToken() {
        return Util.ToStringToken(this.toString());
    },
    writable: true,
    configurable: true
});
Object.defineProperty(String.prototype, "ToIntegerToken", {
    value: function ToIntegerToken() {
        return Util.ToIntegerToken(this.toString());
    },
    writable: true,
    configurable: true
});
Object.defineProperty(String.prototype, "ToBooleanToken", {
    value: function ToBooleanToken() {
        return Util.ToBooleanToken(this.toString());
    },
    writable: true,
    configurable: true
});
