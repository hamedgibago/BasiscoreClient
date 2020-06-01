abstract class Member {
    Name: string;
    Preview: IToken<boolean>;
    Sort: IToken<string>;
    PostSql: IToken<string>;
    ExtraAttributes: IDictionary<IToken<string>>;
    RawContent: IToken<string>;
    constructor(element: Element) {
        this.Name = element.getAttribute('name');
        this.Preview = element.GetBooleanToken('preview');
        this.Sort = element.GetStringToken('sort');
        this.PostSql = element.GetStringToken('postsql');
        this.RawContent = element.textContent.ToStringToken();
    }
    public async AddDataSourceAsync(source: DataTable, sourceSchemaName: string, context: IContext) {
        var postSqlTask = Util.GetValueOrDefaultAsync(this.PostSql, context, null);
        var sortTask = Util.GetValueOrDefaultAsync(this.Sort, context, null);
        var previewTask = Util.GetValueOrDefaultAsync(this.Preview, context, false);
        source.Name = `${sourceSchemaName}.${this.Name}`.toLowerCase();
        Util.AddToContext(source, context, await previewTask, await sortTask, await postSqlTask);
    }
}
