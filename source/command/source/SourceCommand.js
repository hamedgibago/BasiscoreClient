var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//requires: command/Command.js
class SourceCommand extends CommandBase {
    constructor(element, ctorCallback) {
        super(element);
        this.ConnectionName = element.GetStringToken('source');
        this.Members = new Array();
        this.Element.querySelectorAll('member').forEach(elm => this.Members.push(ctorCallback(elm)));
    }
    ExecuteCommandAsync(context) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((((_a = this.Members) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0) {
                var name = yield Util.GetValueOrDefaultAsync(this.Name, context);
                var dataSet = yield this.LoadDataAsync(name, context);
                var tables = Object.getOwnPropertyNames(dataSet.Tabels);
                if (this.Members.length != tables.length) {
                    throw new Error(`Command '${name}' Has ${this.Members.length} Member(s) But ${tables.length} Result(s) Returned From Source!`);
                }
                this.Members.forEach((member, index) => __awaiter(this, void 0, void 0, function* () {
                    var source = dataSet.Tabels[tables[index]];
                    yield member.AddDataSourceAsync(source, name, context);
                }));
            }
            this.Element.remove();
            return VoidResult.Result;
        });
    }
    LoadDataAsync(sourceName, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var connectionName = yield Util.GetValueOrDefaultAsync(this.ConnectionName, context);
            var commnad = this.Element.outerHTML.ToStringToken();
            var params = {
                'command': yield Util.GetValueOrDefaultAsync(commnad, context),
                //'params': null,
                'dmnid': context.GetDefault('dmnid') // context.HostSetting.Settings['default.dmnid']
            };
            var name = yield Util.GetValueOrDefaultAsync(this.Name, context, null);
            return yield context.LoadDataAsync(sourceName, connectionName, params);
        });
    }
}
