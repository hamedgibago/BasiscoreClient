/*
require
    command/Command.js
*/

//https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
//https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
//https://www.w3schools.com/js/js_cookies.asp
class Cookie extends CommandBase {
    Value: IToken<string>;
    MaxAge: IToken<string>;
    Path: IToken<string>;

    constructor(element: Element) {
        super(element);
        this.Value = this.Element.GetStringToken('value');
        this.MaxAge = this.Element.GetStringToken('max-age');
        this.Path = this.Element.GetStringToken('path');
    }
    async ExecuteCommandAsync(context: IContext): Promise<ICommandResult> {
        var name = await Util.GetValueOrDefaultAsync(this.Name, context, null);
        var value = await Util.GetValueOrDefaultAsync(this.Value, context, null);
        var maxAge = await Util.GetValueOrDefaultAsync(this.MaxAge, context, null);
        var path = await Util.GetValueOrDefaultAsync(this.Path, context, null);


        var str = `${name.trim()}=${value || ''}`;
        if (maxAge) {
            str += `;max-age=${maxAge}`;
        }
        if (path) {
            str += `;path=${path.trim()}`;
        }

        document.cookie = str;
        this.Element.remove();
        return VoidResult.Result;
    }
}