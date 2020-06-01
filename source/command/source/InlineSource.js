var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class InlineSource extends SourceCommand {
    constructor(element) {
        super(element, InlineSourceMemberConverter.ConvertToMember);
    }
    ExecuteCommandAsync(context) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((((_a = this.Members) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0) {
                var name = yield Util.GetValueOrDefaultAsync(this.Name, context);
                var tasks = Array();
                this.Members.forEach(member => tasks.push(member.AddDataSourceExAsync(name, context)));
                yield Promise.all(tasks);
            }
            return VoidResult.Result;
        });
    }
}
class InlineSourceMemberConverter {
    static ConvertToMember(element) {
        var _a;
        var retVal = null;
        var type = (_a = element.getAttribute('type')) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        switch (type) {
            case 'sql': {
                retVal = new SqlMember(element);
            }
        }
        return retVal;
    }
}
class InMemoryMember extends Member {
    constructor(element) {
        super(element);
    }
    AddDataSourceExAsync(sourceSchemaName, context) {
        const _super = Object.create(null, {
            AddDataSourceAsync: { get: () => super.AddDataSourceAsync }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var source = yield this.ParseDataAsync(context);
            if (source) {
                _super.AddDataSourceAsync.call(this, source, sourceSchemaName, context);
            }
        });
    }
}
class SqlMember extends InMemoryMember {
    constructor(element) {
        super(element);
        this.DataMemberNames = element.GetStringToken("datamembername");
    }
    ParseDataAsync(context) {
        return __awaiter(this, void 0, void 0, function* () {
            var sources = (yield Util.GetValueOrDefaultAsync(this.DataMemberNames, context)).split(',');
            var sqlTask = Util.GetValueOrDefaultAsync(this.RawContent, context);
            return null;
        });
    }
}
