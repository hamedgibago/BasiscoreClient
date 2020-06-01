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
    command/CommandBase.js
 */
class Command extends CommandBase {
    constructor(element) {
        super(element);
        this.DataSourceId = element.GetStringToken('datamembername');
    }
    ExecuteCommandAsync(context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var dataSourceId = yield Util.GetValueOrDefaultAsync(this.DataSourceId, context, null);
                var source = null;
                if (dataSourceId) {
                    source = yield context.WaitToGetDataSourceAsync(dataSourceId);
                }
                return yield this.ExecuteAsyncEx(source, context);
            }
            catch (ex) {
                this.Element.outerHTML = ex;
                console.error(ex);
            }
        });
    }
    static ToCommand(element) {
        return Convertor.ToCommand(element);
    }
}
