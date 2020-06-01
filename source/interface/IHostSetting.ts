interface IHostSetting {
    Debug: boolean;
    Settings: IDictionary<string | any | IConnectionSetting>;
    OnRendered: { (): void };
    //OnCallExecuted: { (fileName: string, pageSize: string, commnad:string): void };
    OnRendering: { (): any };
    Sources: { [key: string]: Array<any[]> };
}

