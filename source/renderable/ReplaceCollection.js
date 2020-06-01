class ReplaceCollection extends Array {
    constructor(...elements) {
        super(...elements);
    }
    Applay(faceRenderResult) {
        this.forEach(item => faceRenderResult = item.Applay(faceRenderResult));
        return faceRenderResult;
    }
}
