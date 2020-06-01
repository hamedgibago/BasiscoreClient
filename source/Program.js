var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Program {
    static Main() {
        window.onload = (e) => __awaiter(this, void 0, void 0, function* () {
            yield Context.Current.RenderAsync();
            //await Util.f(document.body);
            //var t = Util.ToStringToken('ali is [##cms.data.l1##] or [##e.t.l2|t.y.i3|(33)##] and [##r.y.l4##] end [##');
            // console.log('t', t);
            //var t = new StringObject("serverdata.view.pid|(23)");
            //console.log(await t.GetValueAsync(Context.Current));
            //console.log(await (new BooleanObject("serverdata.param.bool-false").GetValueAsync(Context.Current)));
            //Util.f(document.body);
            //console.log('Start Rendering');
            //await Context.Current.RenderAsync().then(_ => {
            //    //Run this code-block after all command execute
            //    console.log('end in program');
            //    console.log(document.getElementsByClassName('test'));
            //}, reason => { console.log(`end with error:${reason}`); });
            //console.log('end Rendering');
            //Context.Current.WaitToGetDataSourceAsync("serverdata.tree").then(source => {
            //    console.log('TypeScript: serverdata.tree');
            //    console.table(source.Data);
            //});
            //var source = await Context.Current.WaitToGetDataSourceAsync("serverdata.print")
            //console.log('TypeScript: serverdata.print');
            //console.table(source.Data);
        });
    }
}
//class TextTemplate extends HTMLElement  {
//    constructor() {
//        super()
//        this.setAttribute('type', 'text/template');
//        console.log(this);
//    }
//}
//customElements.define('basis-template', TextTemplate, { extends: 'layout' });
Program.Main();
