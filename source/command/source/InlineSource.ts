class InlineSource extends SourceCommand<InMemoryMember> {
    constructor(element: Element) {
        super(element, InlineSourceMemberConverter.ConvertToMember);
    }

    async ExecuteCommandAsync(context: IContext): Promise<ICommandResult> {
        if ((this.Members?.length || 0) > 0) {
            var name = await Util.GetValueOrDefaultAsync(this.Name, context);
            var tasks = Array<Promise<void>>();
            this.Members.forEach(member => tasks.push(member.AddDataSourceExAsync(name, context)));
            await Promise.all(tasks);
        }
        return VoidResult.Result;
    }

}

class InlineSourceMemberConverter {
    static ConvertToMember(element: Element): InMemoryMember {
        var retVal: InMemoryMember = null;
        var type = element.getAttribute('type')?.toLowerCase();
        switch (type) {
            case 'sql': {
                retVal = new SqlMember(element);
            }
        }
        return retVal;
    }
}

abstract class InMemoryMember extends Member {
    constructor(element: Element) {
        super(element);
    }
    async AddDataSourceExAsync(sourceSchemaName: string, context: IContext): Promise<void> {
        var source = await this.ParseDataAsync(context);
        if (source) {
            super.AddDataSourceAsync(source, sourceSchemaName, context);
        }
    }

    abstract async ParseDataAsync(context: IContext): Promise<DataTable>;
}

class SqlMember extends InMemoryMember {

    DataMemberNames: IToken<string>;
    constructor(element: Element) {
        super(element);
        this.DataMemberNames = element.GetStringToken("datamembername");
    }

    async ParseDataAsync(context: IContext): Promise<DataTable> {
        var sources = (await Util.GetValueOrDefaultAsync(this.DataMemberNames, context)).split(',');
        var sqlTask = Util.GetValueOrDefaultAsync(this.RawContent, context);
        return null;
    }
}