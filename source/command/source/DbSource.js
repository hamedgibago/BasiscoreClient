//requires: command/source/SourceCommand.js
class DbSource extends SourceCommand {
    constructor(element) {
        super(element, x => new DbSourceMember(x));
    }
}
