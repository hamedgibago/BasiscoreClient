class RawFace {
    constructor(element) {
        this.ApplyReplace = element.GetBooleanToken('replace');
        this.ApplyFunction = element.GetBooleanToken('function');
        this.Level = element.GetStringToken('level');
        this.RowType = element.GetStringToken('rowtype');
        this.Filter = element.GetStringToken('filter');
        this.Template = element.GetTemplateToken();
    }
}
