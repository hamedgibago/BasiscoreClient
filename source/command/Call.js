var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
require
    command/Command.js
*/
class Call extends CommandBase {
    constructor(element) {
        super(element);
        this.FileName = element.GetStringToken('file');
        this.PageSize = element.GetStringToken('pagesize');
    }
    ExecuteCommandAsync(context) {
        return __awaiter(this, void 0, void 0, function* () {
            var filename = yield Util.GetValueOrDefaultAsync(this.FileName, context, null);
            var pagesize = yield Util.GetValueOrDefaultAsync(this.PageSize, context, null);
            var result = yield yield context.LoadPageAsync(filename, this.Element.outerHTML, pagesize, 0);
            this.Element.outerHTML = result;
            return new VoidResult();
        });
    }
}
