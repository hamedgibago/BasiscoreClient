class Replace {
    constructor(tagName, template) {
        this.TagName = tagName;
        this.Template = template;
    }
    Applay(result) {
        var str = `\\[\\(${this.TagName}\\)(.+?)\\]`;
        var matches = result.matchAll(RegExp(str, "gi"));
        for (const match of matches) {
            var template = this.Template;
            var params = match[1].split('|');
            params.forEach((param, index, _) => template = template.replace(`@val${index + 1}`, param));
            result = result.replace(match[0], template);
        }
        return result;
    }
}
