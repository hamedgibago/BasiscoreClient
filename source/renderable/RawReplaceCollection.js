var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class RawReplaceCollection extends Array {
    static Create(element) {
        var retVal = new RawReplaceCollection();
        element.querySelectorAll('replace').forEach(x => retVal.push(new RawReplace(x)));
        return retVal;
    }
    ProcessAsync(context) {
        return __awaiter(this, void 0, void 0, function* () {
            var taskList = this.map((x) => __awaiter(this, void 0, void 0, function* () {
                return new Replace(yield Util.GetValueOrDefaultAsync(x.TagName, context), yield Util.GetValueOrDefaultAsync(x.Content, context));
            }));
            var list = yield Promise.all(taskList);
            return new ReplaceCollection(...list);
        });
    }
}
