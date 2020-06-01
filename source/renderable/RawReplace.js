class RawReplace {
    constructor(element) {
        this.TagName = element.GetStringToken('tagname');
        this.Content = element.GetTemplateToken();
    }
}
