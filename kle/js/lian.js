/**
 * 竖连
 */
 function shulian(object, num) {
    if (object != '') {
        $('#shulian').html($(object).text());
        $('#shulian2').html($(object).text());
    }
    $('#fl_shulian').attr('style','display:none;');
    $('#fl_shulian2').attr('style','display:none;');
    clickZhilian(num, lianStartIndex, lianEndIndex, 'S', 'qiu_zong');
}

/**
 * 横连
 */
function henglian(object, num) {
    if (object != '') {
        $('#henglian').html($(object).text());
        $('#henglian2').html($(object).text());
    }
    $('#fl_henglian').attr('style','display:none;');
    $('#fl_henglian2').attr('style','display:none;');
    clickZhilian(num, lianStartIndex, lianEndIndex, 'H', 'qiu_lv');
}

/**
 * 斜连
 */
function xielian(object, num) {
    if (object != '') {
        $('#xielian').html($(object).text());
        $('#xielian2').html($(object).text());
    }
    $('#fl_xielian').attr('style','display:none;');
    $('#fl_xielian2').attr('style','display:none;');
    clickXielian(num, lianStartIndex, lianEndIndex);
}

/**
 * 奇数斜连
 */
function jsXielian(object, num) {
    if (object != '') {
        $('#jsxielian').html($(object).text());
        $('#jsxielian2').html($(object).text());
    }
    $('#fl_jsxielian').attr('style','display:none;');
    $('#fl_jsxielian2').attr('style','display:none;');

    var start = $("#tabledata tbody:eq(0) tr:eq(1) th:eq(0)").children('span').text();
    start = parseInt(start);
    if (start % 2 == 0) {
        clickEvenlian(num, lianStartIndex, lianEndIndex);
    } else {
        clickOddlian(num, lianStartIndex, lianEndIndex);
    }
}

/**
 * 偶数斜连
 */
function osXielian(object, num) {
    if (object != '') {
        $('#osxielian').html($(object).text());
        $('#osxielian2').html($(object).text());
    }
    $('#fl_osxielian').attr('style','display:none;');
    $('#fl_osxielian2').attr('style','display:none;');

    var start = $("#tabledata tbody:eq(0) tr:eq(1) th:eq(0)").children('span').text();
    start = parseInt(start);
    if (start % 2 == 0) {
        clickOddlian(num, lianStartIndex, lianEndIndex);
    } else {
        clickEvenlian(num, lianStartIndex, lianEndIndex);
    }
}

/**
 * 直连(横连，竖连)
 */
function clickZhilian(value, sartColIndex, endColIndex, type, ballClass){
    var tbody = document.getElementById(tbodyId);
    if (value >= 2) {
        clearLian(tbodyId, sartColIndex, endColIndex, 0, tbody.rows.length - 1, ballClass, 'qiu_red');
        zhilian(tbodyId,sartColIndex, endColIndex, 0, tbody.rows.length - 1, ballClass, ballClass, value, type);
    } else {
        clearLian(tbodyId, sartColIndex, endColIndex, 0, tbody.rows.length - 1, ballClass, 'qiu_red');
    }
}

/**
 * 斜连
 */
function clickXielian(value, sartColIndex, endColIndex){
    var tbody = document.getElementById(tbodyId);
    if (value >= 2) {
        //开始列,结束列,开始行,结束行 /原来的样式,要替换的样式
        clearLian(tbodyId, sartColIndex, endColIndex, 0, tbody.rows.length - 1, 'qiu_anlv', 'qiu_red');
        xielianSub(tbodyId, sartColIndex, endColIndex, 0, tbody.rows.length - 1, 'qiu_anlv', 'qiu_anlv', value);
    } else {
        clearLian(tbodyId, sartColIndex, endColIndex, 0, tbody.rows.length - 1, 'qiu_anlv', 'qiu_red');
    }
}

/**
 * 偶数斜连
 */
function clickEvenlian(value, sartColIndex, endColIndex) {
    var tbody = document.getElementById(tbodyId);
    if (value >= 2) {
        //从那个列开始到那一列结束
        clearLian(tbodyId, sartColIndex, endColIndex, 0, tbody.rows.length - 1, 'qiu_shenlv', 'qiu_red');
        oddEvenlian(tbodyId, sartColIndex, endColIndex, 0, tbody.rows.length - 1, 'qiu_shenlv', 'qiu_shenlv', 1, value);
    } else {
        clearLian(tbodyId, sartColIndex, endColIndex, 0, tbody.rows.length - 1, 'qiu_shenlv','qiu_red');
    }
}

/**
 * 奇数斜连
 */
function clickOddlian(value, sartColIndex, endColIndex){
    var tbody = document.getElementById(tbodyId);
    if (value >= 2) {
        clearLian(tbodyId, sartColIndex, endColIndex, 0, tbody.rows.length - 1, 'qiu_zi','qiu_red');
        oddEvenlian(tbodyId, sartColIndex, endColIndex, 0, tbody.rows.length - 1, 'qiu_zi', 'qiu_zi', 0, value);
    } else {
        clearLian(tbodyId, sartColIndex, endColIndex, 0, tbody.rows.length - 1, 'qiu_zi','qiu_red');
    }
}

/**
 * 清除连函数
 */
function clearLian(tableid, begincol, endcol, beginclum, endclum, oldclsnam, newclsnam) {

    var vtable = document.getElementById(tableid);
    for (i = beginclum; i <= endclum; i++) {
        for (j = parseInt(begincol); j <= parseInt(endcol); j++) {
            var tmpa = vtable.rows[i].cells[j];
            var tmpacn = getBallClassName(tmpa.className);

            if (tmpacn == oldclsnam) {
                tmpH = tmpa.className;
                tmpa.className = tmpH.replace(getBallClassName(tmpH), newclsnam);
                tmpa.className = newclsnam;
            }
        }
    }
}

/**
 * 确定一个td是否是一个球  是：返回球的classname 否：返回""
 * clsname:一个td所具有的样式
 */
function getBallClassName(clsname) {

    if (clsname == undefined || clsname == "") return "";
    //判断区域内球所有可能的样式
    var arrayObj = new Array('qiu_red','qiu_red_02','qiu_anlv','qiu_lv','qiu_shenlv','qiu_zi','qiu_zong');

    for (m = 0; m < arrayObj.length; m++) {
        tmp = arrayObj[m];
        if (clsname.indexOf(tmp) != -1) {
            return tmp;
        }
    }
    return "";
}

/**
 * 直连函数
 * tableid:表的id
 * begincol:开始列
 * endcol:结束列
 * beginclum:开始行
 * endclum:结束行
 * Hclsnam:横方向classname
 * Sclsnam:竖方向classname
 */
function zhilian(tableid, begincol, endcol, beginclum, endclum, Hclsnam, Sclsnam, qiushu, type) {

    var vtable = document.getElementById(tableid);
    for (ki = beginclum; ki <= endclum; ki++) {
        //开始列
        for (kj = parseInt(begincol); kj <= parseInt(endcol); kj++) {
            var tmpb = vtable.rows[ki].cells[kj];
            var tmpbcn = getBallClassName(tmpb.className);

            if (tmpbcn == Sclsnam || tmpbcn=="") {
                continue;
            } else if (tmpbcn != Sclsnam){
                if (type == 'H') {
                    zhiliansetH(vtable, ki, kj, 1, Hclsnam, endcol, qiushu);
                } else {
                    zhiliansetS(vtable, ki, kj, 1, Sclsnam, endclum, qiushu);
                }
            }
        }
    }
}

/**
 * 直连横坐标探索
 */
function zhiliansetH(vtable, vi, vj, num, Hclsnam, endcol, qiushu) {
    try {
        if (vj + 1 > endcol) throw "border";
        var vt = vtable.rows[vi].cells[vj + 1];
        var vtcn = getBallClassName(vt.className);
        var trc = vtable.rows[vi];

        if (vtcn != "") {   //找到 继续探索
            zhiliansetH(vtable, vi, vj + 1, num + 1, Hclsnam, endcol, qiushu);
        } else {   //没有找到指定calssname
            if (num >= qiushu) {  //替换样式
                for (j = vj; j > vj - num; j--) {
                    tmpH = (vtable.rows[vi].cells[j]).className;
                    vtable.rows[vi].cells[j].className = Hclsnam;
                }
            }
        }
    } catch(e) {
        if (num >= qiushu) {  //替换样式
            for (j = vj; j > vj - num; j--) {
                tmpH = (vtable.rows[vi].cells[j]).className;
                vtable.rows[vi].cells[j].className = Hclsnam;
            }
        }
    }
    return;
}

/**
 *直连竖坐标探索
 */
function zhiliansetS(vtable, vi, vj, num, Sclsnam, endclum, qiushu) {

    try {
        //如果是有辅助线的话num的值要相对减少一个
        if (vi + 1 > endclum) throw "border";

        var vt = vtable.rows[vi + 1].cells[vj]; //看看下一行的同列是否是个出球号
        var vtcn = getBallClassName(vt.className);

        if (vtcn != "") {   //找到 继续探索
            zhiliansetS(vtable, vi + 1, vj, num + 1, Sclsnam, endclum, qiushu);
        } else {   //没有找到指定calssname   
            if (num >= qiushu) {  //替换样式
                for (i = vi; i > vi - num; i--) {
                    tmpS = (vtable.rows[i].cells[vj]).className;
                    vtable.rows[i].cells[vj].className = Sclsnam;
                }
            }
        }
    } catch(e) {
        if (num >= qiushu) {  //替换样式
            for (i = vi; i > vi - num; i--) {
                tmpS = (vtable.rows[i].cells[vj]).className;
                vtable.rows[i].cells[vj].className = Sclsnam;
            }
        }
    }
    return;
}

/**
 * 斜连函数
 * tableid:表的id
 * begincol:开始列
 * endcol:结束列
 * beginclum:开始行
 * endclum:结束行
 * Rclsnam:右下方classname
 * Lclsnam:左下方classname
 */
function xielianSub(tableid, begincol, endcol, beginclum, endclum, Rclsnam, Lclsnam, qiushu) {

    var vtable = document.getElementById(tableid);
    for (i = beginclum; i <= endclum; i++) {//开始行
        for (j = parseInt(begincol); j <= parseInt(endcol); j++) { //开始列
            var tmpa = vtable.rows[i].cells[j];
            var tmpacn = getBallClassName(tmpa.className);

            if (tmpacn == Rclsnam || tmpacn == "") {
                continue;
            } else if (tmpacn!=Rclsnam) {
                xieliansetR(vtable,i,j,1,Rclsnam,endcol,endclum,qiushu);
            }
        }
    }
    for (ki = beginclum; ki <= endclum; ki++) {
        for (kj = parseInt(begincol); kj <= parseInt(endcol); kj++) {
            var tmpb = vtable.rows[ki].cells[kj];
            var tmpbcn = getBallClassName(tmpb.className);
            if (tmpbcn=="") {
                continue;
            } else {
                xieliansetL(vtable, ki, kj, 1, Lclsnam, begincol, endclum, qiushu);
            }
        }
    }
}

/**
 * 右下135度坐标探索
 */
function xieliansetR(vtable, vi, vj, num, Rclsnam, endcol, endclum, qiushu) {

    try {
        //如果大与结束列 或者大于结束行
        if (vj + 1 > endcol || vi + 1 > endclum) throw "border";
        var vt = vtable.rows[vi + 1].cells[vj + 1]; //下一行的的下一个列
        var vtcn = getBallClassName(vt.className); //判断是否是球 

        if (vtcn != "" ){   //找到 继续探索   
            xieliansetR(vtable, vi + 1, vj + 1, num + 1, Rclsnam, endcol, endclum, qiushu);
        } else {   //没有找到指定calssname         
            if (num >= qiushu) {  //替换样式
                for (k = 0; k < num; k++) {
                    tmpH = vtable.rows[vi - k].cells[vj - k].className;
                    (vtable.rows[vi - k].cells[vj - k]).className = tmpH.replace(getBallClassName(tmpH), Rclsnam);
                }
            }
        }
    } catch(e) {
        if(num >= qiushu){  //替换样式
            for (k = 0; k < num; k++) {
                tmpH = vtable.rows[vi - k].cells[vj - k].className;
                (vtable.rows[vi - k].cells[vj - k]).className = tmpH.replace(getBallClassName(tmpH), Rclsnam);
            }
        }
    }
    return;
}

/**
 * 左下225度坐标探索
 */
function xieliansetL(vtable, vi, vj, num, Lclsnam, begincol, endclum, qiushu){

    try{
        if (vj - 1 < begincol || vi + 1 > endclum) throw "border";
        var vt = vtable.rows[vi + 1].cells[vj - 1];
        var vtcn = getBallClassName(vt.className);
        if (vtcn!="") {   //找到 继续探索
            xieliansetL(vtable, vi + 1, vj - 1, num + 1, Lclsnam, begincol, endclum, qiushu);
        } else {   //没有找到指定calssname
            if (num >= qiushu) {  //替换样式
                for (k = 0; k < num; k++) {
                    tmpH = vtable.rows[vi - k].cells[vj + k].className;
                    (vtable.rows[vi - k].cells[vj + k]).className = tmpH.replace(getBallClassName(tmpH), Lclsnam);
                }
            }
        }
    } catch(e) {
        if (num >= qiushu) {  //替换样式
            for (k = 0; k < num; k++) {
                tmpH = vtable.rows[vi - k].cells[vj + k].className;
                (vtable.rows[vi - k].cells[vj + k]).className = tmpH.replace(getBallClassName(tmpH), Lclsnam);
            }
        }
    }
    return;
}

/**
 * 奇数偶数连函数
 * tableid:表的id
 * begincol:开始列（从1开始）
 * endcol:结束列
 * beginclum:开始行
 * endclum:结束行
 * Rclsnam:右下方classname
 * Lclsnam:左下方classname
 * pluscol：奇数偶数偏移(奇数为0，偶数为1）
 */
function oddEvenlian(tableid, begincol, endcol, beginclum, endclum, Rclsnam, Lclsnam, pluscol, qiushu) {

    var vtable = document.getElementById(tableid);
    for (var i = beginclum; i <= endclum; i++) {
        for (var j = parseInt(begincol) + parseInt(pluscol); j <= endcol; j = j + 2) {
            var tmpa = vtable.rows[i].cells[j];
            var tmpacn = getBallClassName(tmpa.className);
            if (tmpacn == Rclsnam || tmpacn == "") {
                continue;
            } else {
                oddEvenliansetR(vtable, i, j, 1, Rclsnam, endcol, endclum, qiushu);
            }
        }
    }
    for (ki = beginclum; ki <= endclum; ki++){
        for (kj = parseInt(begincol) + parseInt(pluscol); kj <= endcol; kj = kj + 2) {
            var tmpa = vtable.rows[ki].cells[kj];
            var tmpacn = getBallClassName(tmpa.className);
            if (tmpacn == "") {
                continue;
            } else {
                oddEvenliansetL(vtable, ki, kj, 1, Lclsnam, begincol, endclum, qiushu);
            }
        }
    }
}

/**
 * 右下坐标探索
 */
function oddEvenliansetR(vtable, vi, vj, num, Rclsnam, endcol, endclum, qiushu){
    try {
        if (vj + 2 > endcol || vi + 1 > endclum) throw "border";
        var vt = vtable.rows[vi + 1].cells[vj + 2];
        var vtcn = getBallClassName(vt.className);
        if (vtcn != "") {   //找到 继续探索
            oddEvenliansetR(vtable, vi + 1, vj + 2, num + 1, Rclsnam, endcol, endclum, qiushu);
        } else {   //没有找到指定calssname
            if (num >= qiushu) {  //替换样式
                for (k = 0; k < num; k++) {
                    tmpH = (vtable.rows[vi - k].cells[vj - 2 * k]).className;
                    (vtable.rows[vi - k].cells[vj - 2 * k]).className = tmpH.replace(getBallClassName(tmpH), Rclsnam);
                }
            }
        }
    } catch(e) {
        if (num >= qiushu) {  //替换样式
            for (k = 0; k < num; k++) {
                tmpH = (vtable.rows[vi - k].cells[vj - 2 * k]).className;
                (vtable.rows[vi - k].cells[vj - 2 * k]).className = tmpH.replace(getBallClassName(tmpH), Rclsnam);
            }
        }
    }
    return;
}

/**
 * 左下坐标探索
 */
function oddEvenliansetL(vtable, vi, vj, num, Lclsnam, begincol, endclum, qiushu) {

    try  {
        if (vj - 2 < begincol || vi + 1 > endclum) throw "border";
        var vt = vtable.rows[vi + 1].cells[vj - 2];
        var vtcn = getBallClassName(vt.className);
        if (vtcn!="") {   //找到 继续探索
            oddEvenliansetL(vtable, vi + 1, vj - 2, num + 1, Lclsnam, begincol, endclum, qiushu);
        } else {   //没有找到指定calssname
            if (num >= qiushu) {  //替换样式
                for (k = 0; k < num; k++){
                    tmpH = (vtable.rows[vi - k].cells[vj + 2 * k]).className;
                    (vtable.rows[vi - k].cells[vj + 2 * k]).className = tmpH.replace(getBallClassName(tmpH), Lclsnam);
                }
            }
        }
    } catch(e) {
        if (num >= qiushu) {  //替换样式
            for (k = 0; k < num; k++) {
                tmpH = (vtable.rows[vi - k].cells[vj + 2 * k]).className;
                (vtable.rows[vi - k].cells[vj + 2 * k]).className = tmpH.replace(getBallClassName(tmpH), Lclsnam);
            }
        }
    }
    return;
}

/**
 * 鼠标划过竖连
 */
function lianHover() {
    document.onmouseover = function(event){
        var e = event || window.event;
        var elem = e.srcElement || e.target;
        var cz_arr = new Array("shulian", "henglian", "xielian", "jsxielian", "osxielian", "shulian2", "henglian2", "xielian2", "jsxielian2", "osxielian2");
        while (elem) {
            try {
                for (var i = 0; i < cz_arr.length; i++) {
                    if (typeof($(elem).attr('id')) != 'undefined' && ($(elem).attr('id') == cz_arr[i] || $(elem).attr('id') == 'fl_' + cz_arr[i])) {
                        // 如何当前坐标在层上则返回    
                        if ($("#fl_" + cz_arr[i]).is(":visible")) {
                            $("#" + cz_arr[i]).parent().removeClass("hover")
                            $("#fl_" + cz_arr[i]).hide();
                        } else {
                            $("#" + cz_arr[i]).parent().addClass("hover");
                            $("#fl_" + cz_arr[i]).show();
                        }
                        return;
                    } else {
                        $("#" + cz_arr[i]).parent().removeClass("hover")
                        $("#fl_" + cz_arr[i]).hide();
                    }
                }
            } catch(err) {
                // 卸载onmouseover事件    
                document.onclick = null;
            }
            elem = elem.parentNode;
        }
        // 卸载onmouseover事件
        document.onclick = null;
    };
}     