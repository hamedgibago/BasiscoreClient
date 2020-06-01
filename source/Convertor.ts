class Convertor {
    public static ToCommand(element: Element): ICommand {
        var core = element.getAttribute('core');
        var retVal: ICommand;
        switch (core) {
            case "group":
                {
                    retVal = new Group(element);
                    break;
                }
            case "print":
                {
                    retVal = new Print(element);
                    break;
                }
            case "tree":
                {
                    retVal = new Tree(element);
                    break;
                }
            case "list":
                {
                    retVal = new List(element);
                    break;
                }
            case "view":
                {
                    retVal = new View(element);
                    break;
                }
            case "dbsource":
                {
                    retVal = new DbSource(element);
                    break;
                }
            case "call":
                {
                    retVal = new Call(element);
                    break;
                }
            case "cookie":
                {
                    retVal = new Cookie(element);
                    break;
                }
            default:
                {
                    retVal = new UnknownCommand(element);
                    break;
                }
        }
        return retVal;
    }
}
