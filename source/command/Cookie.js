/*
require
    command/Command.js
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
//https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
//https://www.w3schools.com/js/js_cookies.asp
class Cookie extends CommandBase {
    constructor(element) {
        super(element);
        this.Value = this.Element.GetStringToken('value');
        this.MaxAge = this.Element.GetStringToken('max-age');
        this.Path = this.Element.GetStringToken('path');
    }
    ExecuteCommandAsync(context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var name = yield Util.GetValueOrDefaultAsync(this.Name, context, null);
                var value = yield Util.GetValueOrDefaultAsync(this.Value, context, null);
                var maxAge = yield Util.GetValueOrDefaultAsync(this.MaxAge, context, null);
                var path = yield Util.GetValueOrDefaultAsync(this.Path, context, null);
                var str = `${name.trim()}=${value || ''}`;
                if (maxAge) {
                    str += `;max-age=${maxAge}`;
                }
                if (path) {
                    str += `;path=${path.trim()}`;
                }
                document.cookie = str;
                this.Element.remove();
            }
            catch (ex) {
                this.Element.outerHTML = ex;
                console.error(ex);
            }
            return new VoidResult();
        });
    }
}
