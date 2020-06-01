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
class RenderableBase extends Command {
    constructor(element) {
        var _a, _b, _c;
        super(element);
        this.Layout = (_a = element.querySelector('layout')) === null || _a === void 0 ? void 0 : _a.GetTemplateToken();
        this.ElseLayout = (_b = element.querySelector('else-layout')) === null || _b === void 0 ? void 0 : _b.GetTemplateToken();
        this.IncompleteTemplate = (_c = element.querySelector('incomplete')) === null || _c === void 0 ? void 0 : _c.GetTemplateToken();
        var devider = element.querySelector('divider');
        this.DividerTemplate = devider === null || devider === void 0 ? void 0 : devider.GetTemplateToken();
        this.DividerRowcount = devider === null || devider === void 0 ? void 0 : devider.GetIntegerToken("rowcount");
        this.RawReplaces = RawReplaceCollection.Create(element);
        this.RawFaces = RawFaceCollection.Create(element);
    }
    ExecuteAsyncEx(dataSource, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var faces = yield this.RawFaces.ProcessAsync(dataSource, context);
            var replaces = yield this.RawReplaces.ProcessAsync(context);
            var dividerRowcount = yield Util.GetValueOrDefaultAsync(this.DividerRowcount, context, 0);
            var dividerTemplate = yield Util.GetValueOrDefaultAsync(this.DividerTemplate, context);
            var incompleteTemplate = yield Util.GetValueOrDefaultAsync(this.IncompleteTemplate, context);
            var result = yield this.RenderAsync(dataSource, context, faces, replaces, dividerRowcount, dividerTemplate, incompleteTemplate);
            if (Util.HasValue(result) && result.length > 0) {
                var layout = yield Util.GetValueOrDefaultAsync(this.Layout, context, '@child');
                result = Util.ReplaceEx(layout, '@child', result);
            }
            else {
                result = yield Util.GetValueOrDefaultAsync(this.ElseLayout, context, "");
            }
            this.Element.outerHTML = result;
            return new VoidResult();
        });
    }
    RenderAsync(dataSource, context, faces, replaces, dividerRowcount, dividerTemplate, incompleteTemplate) {
        return new Promise(resolve => {
            var param = new RenderParam(replaces, dataSource.Data.Rows.length, dividerRowcount, dividerTemplate, incompleteTemplate);
            var result = "";
            dataSource.Data.Rows.forEach((row, _index, _) => {
                param.Data = row;
                result += faces.Render(param, context);
            });
            resolve(result);
        });
    }
}
