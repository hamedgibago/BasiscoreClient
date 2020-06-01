interface IDebugContext extends IDebugLogger, IDebugStep, ICommandResult
{
    RequestId: string;
    //IDebugStep NewStep(string title);
    //IDebugStep NewWait(string title);
    //IDebugContext NewContext(string title);
    AddDebugInformation(debugInfo:IDebugInfo ):void;
    InDebugMode: boolean;

}

interface IDebugLogger {
    LogError(message: string, exception: Error): void;
    LogInformation(message: string): void;
    LogWarning(message: string): void;
}

interface IDebugInfo extends ICommandResult { }

interface IDebugStep //extends IDisposable
{
    //string Title { get; }
    //DateTime Start { get; }
    //long Offset { get; }
    Complete(): void;
}