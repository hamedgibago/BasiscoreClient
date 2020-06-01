class RawReplace {
    TagName: IToken<string>;
    Content: IToken<string>;

    constructor(element: Element) {
        this.TagName = element.GetStringToken('tagname');
        this.Content = element.GetTemplateToken();
    }
}