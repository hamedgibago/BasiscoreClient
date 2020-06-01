class ConfigNotFoundException extends ClientException {
    constructor(configFile:string, configKey:string) {
        super(`In '${configFile}' object, property '${configKey}' not configured!`)
    }
}