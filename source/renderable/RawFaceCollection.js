var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class RawFaceCollection extends Array {
    static Create(element) {
        var retVal = new RawFaceCollection();
        element.querySelectorAll('face').forEach(x => retVal.push(new RawFace(x)));
        return retVal;
    }
    ProcessAsync(dataSource, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var facesTask = this.map((x) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                var applyReplace = yield Util.GetValueOrDefaultAsync(x.ApplyReplace, context, false);
                var applyFunction = yield Util.GetValueOrDefaultAsync(x.ApplyFunction, context, false);
                var rowType = yield this.GetRowTypeAsync(x.RowType, context);
                var levels = (_b = (_a = (yield Util.GetValueOrDefaultAsync(x.Level, context))) === null || _a === void 0 ? void 0 : _a.split("|")) !== null && _b !== void 0 ? _b : null;
                var relatedRows = Util.ApplayFilter(dataSource.Data, yield Util.GetValueOrDefaultAsync(x.Filter, context));
                var template = yield Util.GetValueOrDefaultAsync(x.Template, context, '');
                dataSource.Data.Columns.forEach((col, index) => {
                    if (col.length > 0) {
                        template = Util.ReplaceEx(template, `@${col}`, `@col${index + 1}`);
                    }
                });
                return {
                    ApplyFunction: applyFunction,
                    ApplyReplace: applyReplace,
                    RowType: rowType,
                    FormattedTemplate: template,
                    Levels: levels,
                    RelatedRows: relatedRows
                };
            }));
            var faces = yield Promise.all(facesTask);
            return new FaceCollection(...faces);
        });
    }
    GetRowTypeAsync(token, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var retVal = FaceRowType.NotSet;
            var value = yield Util.GetValueOrDefaultAsync(token, context);
            if (value) {
                var list = Object.getOwnPropertyNames(FaceRowType).filter(x => Util.StringEqual(x, value));
                retVal = list.length == 1 ? FaceRowType[list[0]] : FaceRowType.NotSet;
            }
            return retVal;
        });
    }
}
