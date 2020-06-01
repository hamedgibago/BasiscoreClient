class RenderParam {
    constructor(replaces, renderableCount, recoredPerRow, dividerTemplate, incompleteTemplate) {
        this._RenderableCount = 0;
        this._CellPerRow = 0;
        this.Replaces = replaces;
        this._CellPerRow = recoredPerRow;
        this._RenderableCount = renderableCount;
        this.DividerTemplate = dividerTemplate;
        this.IncompleteTemplate = incompleteTemplate;
        this._RenderedCount = 0;
    }
    get IsEnd() {
        return this._RenderableCount == this._RenderedCount;
    }
    get EmptyCell() {
        return this._CellPerRow - this._RenderedCell;
    }
    get RowType() {
        return (this._RenderedCount % 2 == 0) ? FaceRowType.Even : FaceRowType.Odd;
    }
    get MustApplayDivider() {
        return this.DividerTemplate != null && this._RenderedCell == 0 && !this.IsEnd;
    }
    SetLevel(levels) {
        this.Levels = levels;
    }
    SetRendered() {
        this._RenderedCount++;
        if (this._CellPerRow != 0) {
            this._RenderedCell = this._RenderedCount % this._CellPerRow;
        }
    }
    SetIgnored() {
        this._RenderedCount--;
    }
}
