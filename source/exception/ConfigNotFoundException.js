class ConfigNotFoundException extends ClientException {
    constructor(configFile, configKey) {
        super(`In '${configFile}' object, property '${configKey}' not configured!`);
    }
}
