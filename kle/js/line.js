/* 连线类  ---- */
JoinLine=function(color,size){
    this.color=color||"#000000";
    this.size=size||1;
    this.lines=[];
    this.tmpDom=null;
    this.visible=true;
    var cenbox=document.getElementById('container');//for center div
    this.box=document.body;
    if(cenbox){//兼容居中div
        //this.wrap=cenbox.getElementsByTagName('DIV')[0];
        this.wrap = cenbox;
        if (this.wrap) {
            this.box = this.wrap
            this.wrap.style.position='relative';
        }
    };
};
JoinLine.prototype={
    show:function(yes){
        for(var i=0;i<this.lines.length;i++)
            this.lines[i].style.visibility=yes?"visible":"hidden";
    },
    remove:function(){
        for(var i=0;i<this.lines.length;i++)
            this.lines[i].parentNode.removeChild(this.lines[i]);
        this.lines=[];
    },
    join:function(objArray,hide,fn){
        this.remove();
        this.visible=hide?"visible":"hidden";
        this.tmpDom=document.createDocumentFragment();
        for(var i=0;i<objArray.length-1;i++){
            var a=this.pos(objArray[i]);
            var b=this.pos(objArray[i+1]);
            //alert("A.x*: " + a.x + " * A.y*: " + a.y + " *B.x*: " + b.x + " *B.y*: " + b.y);
            /* 通过比对两个值来决策绘制与否 */
            if(fn&&fn(a,b)===false)continue;
            if(document.all &&
                !(navigator.appName == "Microsoft Internet Explorer"
                    && (navigator.appVersion.match(/9./i)=="9." || document.documentMode == 10 || document.documentMode == 11))){
                this.IELine(a.x,a.y,b.x,b.y)
            }else{
                this.FFLine(a.x,a.y,b.x,b.y)
            };
        };
        this.box.appendChild(this.tmpDom);
    },
    pos:function(obj){
        //alert(obj.offsetWidth);
        if(obj.nodeType==undefined)return obj;// input {x:x,y:y} return;
        var pos={x:0,y:0},a=obj;
        for(;a;a=a.offsetParent){pos.x+=a.offsetLeft;pos.y+=a.offsetTop;if(this.wrap&&a.offsetParent===this.wrap)break};// 兼容居中div
        pos.x+=parseInt(obj.offsetWidth/2);
        pos.y+=parseInt(obj.offsetHeight/2);
        return pos;
    },
    _oldDot:function (x,y,color,size){
        var dot=document.createElement("DIV");
        dot.style.cssText="position: absolute; left: "+x+"px; top: "+y+"px;background: "+color+";width:"+size+"px;height:"+size+"px;font-size:1px;overflow:hidden";
        dot.style.visibility=this.visible;
        this.lines.push(this.tmpDom.appendChild(dot));
    },
    _oldLine:function(x1,y1,x2,y2){
        var r=Math.floor(Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)));
        var theta=Math.atan((x2-x1)/(y2-y1));
        if(((y2-y1)<0&&(x2-x1)>0)||((y2-y1)<0&&(x2-x1)<0))	theta=Math.PI+theta;
        var dx=Math.sin(theta),dy=Math.cos(theta),i=0;
        do{this.FFDot(x1+i*dx,y1+i*dy,this.color,this.size)}while(i++<r);
    },
    FFLine:function(x1,y1,x2,y2){
        //if(Math.abs(y1-y2)<(JoinLine.indent*2)&&x1==x2)return;//自动确定同列的是否连线		
        var np=this.nPos(x1,y1,x2,y2,JoinLine.indent);        //两端缩减函数（防止覆盖球）
        x1=np[0];y1=np[1];x2=np[2];	y2=np[3];
        var cvs=document.createElement("canvas");
        cvs.style.position="absolute";
        cvs.style.visibility=this.visible;
        cvs.width=Math.abs(x1-x2)||this.size;
        cvs.height=Math.abs(y1-y2)||this.size;
        var newY=Math.min(y1,y2);
        var newX=Math.min(x1,x2);
        cvs.style.top=newY+"px";
        cvs.style.left=newX+"px";
        var FG=cvs.getContext("2d");
        FG.save();//缓存历史设置
        FG.strokeStyle=this.color;
        FG.lineWidth=this.size;
        //FG.globalAlpha=0.5;//透明度；	
        FG.beginPath();
        FG.moveTo(x1-newX,y1-newY);
        FG.lineTo(x2-newX,y2-newY);
        FG.closePath();
        FG.stroke();
        FG.restore();//恢复历史设置
        this.lines.push(cvs);
        this.tmpDom.appendChild(cvs);
    },
    IELine:function(x1,y1,x2,y2){
        //if(Math.abs(y1-y2)<(JoinLine.indent*2)&&x1==x2)return;//自动确定同列的是否连线
        var np=this.nPos(x1,y1,x2,y2,JoinLine.indent);        //两端缩减函数（防止覆盖球）
        x1=np[0];y1=np[1];x2=np[2];	y2=np[3];
        var line = document .createElement( "<v:line></v:line>" );
        line.from=x1+","+y1;
        line.to=x2+","+y2;
        line.strokeColor=this.color;
        line.strokeWeight=this.size+"px";
        line.style.cssText="position:absolute;z-index:999;top:0;left:0";
        line.style.visibility=this.visible;
        line.coordOrigin="0,0";
        this.lines.push(line);
        this.tmpDom.appendChild(line);
    },
    nPos:function(x1, y1, x2, y2, r){
        var a = x1 - x2, b = y1 - y2;
        var c = Math.round(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
        var x3, y3, x4, y4;
        var _a = Math.round((a * r)/c);
        var _b = Math.round((b * r)/c);
        return [x2 + _a, y2 + _b, x1 - _a, y1 - _b];
    }
};
JoinLine.indent=7;

/* 过滤搜索连线操纵类 ---- */
LG=function(table,_x,_y,width,margin_bottom,css_name,fn_check){
    var rect={x:_x||0,y:_y||0,w:width||0,oh:margin_bottom||0};
    var trs;
    if (isIE()) {
        trs=document.getElementById(table).rows;
    } else {
        trs = (document.getElementById("tabledata").getElementsByTagName("tbody"))[1].rows;
    }
    var row_start=rect.y<0?(trs.length+rect.y):rect.y;
    var row_end=trs.length-rect.oh;
    var col_start=rect.x<0?(trs[row_start].cells.length+rect.x):rect.x;
    var col_end=parseInt(col_start)+parseInt(rect.w);
    if(col_end>trs[row_start].cells.length)col_end=trs[row_start].cells.length;
    if(rect.w==0)col_end=trs[row_start].cells.length;
    this.g=[];
    //alert([row_start,row_end,col_start,col_end]);
    for(var i=row_start;i<row_end;i++){/* each and grouping */
        var tr=trs[i].cells;
        for(var j=col_start;j<col_end;j++){
            var td=tr[j];
            /* 检测器返回绝对真时，单元格才被添加到组 */
            if(td){
                if(fn_check(td,css_name,j,i)===true)this.g.push(td);
            }
        };
    };
    if(LG.autoDraw)this.draw();
};
//LG.color='#E4A8A8';
LG.color='#898989'; //默认线的颜色为灰色
LG.size=2;
LG.autoDraw=true;   /* 默认自动绘线 */
LG.isShow=true;
LG.filter=function(){};
LG.prototype={
    draw:function(color,size,fn){
        this.line=new JoinLine(color||LG.color,size||LG.size);
        if(!fn)fn=LG.filter;
        this.line.join(this.g,LG.isShow,fn);
    },
    clear:function(){
        this.line.remove();
    },
    show:function(yes){this.line.show(yes)}
}

/* 批量绘线对象类 ---- */
/* 设置表格；设置开关；设置检测函数；添加块；x坐标从0开始 显示；修改模式；添加；再显示；
   error:如果检测函数第一次显示无效，第二次会被覆盖掉 */
oZXZ={
    vg:[],
    lg:[],
    _vg:[],
    _lg:[],
    css_name:[],
    table:false,
    check:function(td,cssName){
        for (var i = 0; i < cssName.length; i++) {
            if (td.className == cssName[i]) {
                return true;
            }
        }
        return false;
    },
    on_off:true,
    _on:true,/* 开关反作用 */
    novl:false,/* 忽略垂直线 */
    bind:function(tid,_css_name,_on_off){
        this.table=tid;
        for(var i=0;i<_css_name.length;i++){this.css_name.push(_css_name[i])};
        this.on_off=_on_off;
        return this;
    },
    color:function(c){
        LG.color=c;
        return this;
    },
    newCheck:function(fn){
        this.check=fn;
        return this;
    },
    draw:function(yes){
        if(!this.table)return;
        if(yes){
            var qL=this.vg.length;
            for(var i=0;i<qL;i++){
                var it=this.vg[i];
                LG.color=it.color;
                JoinLine.indent=it.indent;
                this.novl=it.novl;
                if(this.novl)LG.filter=function(a,b){return !(a.x==b.x)};
                this.lg.push(new LG(this.table,it[0],it[1],it[2],it[3],this.css_name,this.check));
            }
        }
        if(this.on_off){
            var _this=this;
            $=document.getElementById(this.on_off);
            if($)$.onclick=function(){
                var yes=_this._on?this.checked:!this.checked;
                _this.show(yes);
            };
        }
        /* 转移与清空历史记录，等待下一次添加 */
        this._vg=this._vg.concat(this.vg);
        this.vg=[];
        this._lg=this._lg.concat(this.lg);
        this.lg=[];
        return this;
    },
    show:function(yes){
        /* 如果没有线则重绘一次 */
        if(this._lg.length==0)this.redraw();
        var qL=this._lg.length;
        for(var i=0;i<qL;i++){this._lg[i].show(yes)};
    },
    /*
    x,y,w,-bottom
    */
    add:function(x,y,w,mb,lc,li){//把每一块封成组加上属性
        this.vg.push([x,y,w,mb]);
        /* 记录本组缩进与颜色 */
        if (lc == undefined || lc == null || lc == '') {
            lc = LG.color;
        }
        this.vg[this.vg.length-1].color=lc;
        if (li == undefined || li == null || li == '') {
            li = JoinLine.indent;
        }
        this.vg[this.vg.length-1].indent=li;
        this.vg[this.vg.length-1].novl=this.novl;
        return this;
    },
    clear:function(){
        for(var i=0;i<this._lg.length;i++)
            this._lg[i].clear();
        return this;
    },
    redraw:function(){
        this.clear();
        this.vg=this.vg.concat(this._vg);
        this._vg=[];
        this.draw(true);
    },
    newCheck:function(fn){
        this.check=fn;
        return this;
    },
    setvl:function(v){
        this.novl=v;
        return this;
    },
    indent:function(v){
        JoinLine.indent=v;
        return this;
    }
}
/*
line Color:
青绿色:#C5C50A;
橙色:#FF9916;
深粉:#FB9D82;
*/