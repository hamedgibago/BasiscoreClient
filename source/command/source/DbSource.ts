//requires: command/source/SourceCommand.js
class DbSource extends SourceCommand<DbSourceMember> {
    constructor(element: Element) {
        super(element, x => new DbSourceMember(x));
    }
}

