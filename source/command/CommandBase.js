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
    interface\ICommand.js
*/
class CommandBase {
    constructor(element) {
        this.Core = element.getAttribute('core');
        this.Id = element.getAttribute('id');
        this.Name = element.GetStringToken('name');
        this.RunType = element.GetStringToken('run');
        this.If = element.GetStringToken('if');
        this.Element = element;
    }
    ExecuteAsync(context) {
        return __awaiter(this, void 0, void 0, function* () {
            var retVal = null;
            switch (yield this.GetRunTypeValue(context)) {
                case RunType.atclient: {
                    if (yield this.GetIfValue(context)) {
                        retVal = yield this.ExecuteCommandAsync(context);
                    }
                    else {
                        this.Element.outerHTML = "";
                        retVal = VoidResult.Result;
                    }
                }
            }
            return retVal;
        });
    }
    ExecuteCommandAsync(context) {
        throw new Error("'ExecuteCommandAsync' Not Implemented");
    }
    GetIfValue(context) {
        return __awaiter(this, void 0, void 0, function* () {
            var value = yield Util.GetValueOrDefaultAsync(this.If, context, null);
            return value ? value.Evaluating() : true;
        });
    }
    GetRunTypeValue(context) {
        return __awaiter(this, void 0, void 0, function* () {
            var value = yield Util.GetValueOrDefaultAsync(this.RunType, context, "atclient");
            return RunType[value.toLowerCase()];
        });
    }
}
