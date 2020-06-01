Object.defineProperty(Element.prototype, "GetStringToken", {
    value: function GetStringToken(attributeName) {
        var retVal;
        var tmp = (this.getAttribute(attributeName));
        if (tmp) {
            retVal = tmp.ToStringToken();
        }
        return retVal;
    },
    writable: true,
    configurable: true
});
Object.defineProperty(Element.prototype, "GetIntegerToken", {
    value: function GetIntegerToken(attributeName) {
        var retVal;
        var tmp = (this.getAttribute(attributeName));
        if (tmp) {
            retVal = tmp.ToIntegerToken();
        }
        return retVal;
    },
    writable: true,
    configurable: true
});
Object.defineProperty(Element.prototype, "GetBooleanToken", {
    value: function GetBooleanToken(attributeName) {
        var retVal;
        var tmp = (this.getAttribute(attributeName));
        if (tmp) {
            retVal = tmp.ToBooleanToken();
        }
        return retVal;
    },
    writable: true,
    configurable: true
});
Object.defineProperty(Element.prototype, "GetTemplateToken", {
    value: function GetTemplateToken() {
        var retVal;
        if (this.children.length == 1 &&
            Util.StringEqual(this.children[0].nodeName, 'script') &&
            Util.StringEqual(this.children[0].getAttribute('type'), "text/template")) {
            retVal = this.textContent.ToStringToken();
        }
        else {
            retVal = this.innerHTML.ToStringToken();
        }
        return retVal;
    },
    writable: true,
    configurable: true
});
