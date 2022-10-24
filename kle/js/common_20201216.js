// 断区分布默认为False
var hasDuanqu = false;
// 竖滚动条的相对位置(以Chrome为标准)
var scrollYPostion = 395;
// BODY对象高度(以Chrome为标准)
var bodyClientHeight = 1615;
// 连线缩进
var lineIndent = 7;
//高级筛选，期数设置点击事件
var arrOnclick = new Array('0', '0', '0', '0', '0');

/**
 * 页面加载完后，画线
 */
$(document).ready(function() {

    if (hasZhexian == true) {
        // 画线
        drawLine(tbodyId, startIndex, len, cssName, lineColor);
    }

    if (hasDuanqu == true) {
        //默认断区显示
        showDuanqu($('#dqxsUp'));
    }
    /******************************************************/
    var lot = $('#lotteryId').val();

    if (lot == '11x5') {
        /***************************************************************/
        // 高频彩需区分地区和形态
        // 如果是11选5和时时彩，需要区分是哪个地区
        if ($('#area').length > 0) {
            lot = lot + '-' + $('#area').val();
        }
        // 如果是11选5和时时彩，需要区分形态（11选5：前一，前二，前三，任二-任八；时时彩：二星，三星）
        var tem = '';
        if ($('#filterZbName').length > 0 && $('#filterZbName').val() != "") {
            tem = $('#filterZbName').val().substr(0, 4);
            lot = lot + '-' + tem;

        }
        //alert(lot);
        /***************************************************************/
        if('qezx' == tem) {
            tem = '前二组选';
        }else if('qedx' == tem) {
            tem = '前二直选';
        } else if('qszx' == tem) {
            tem = '前三组选';
        }else if('qsdx' == tem) {
            tem = '前三直选';
        }else if('rxer' == tem) {
            tem = '任选二';
        }else if('rxsa' == tem) {
            tem = '任选三';
        }else if('rxsi' == tem) {
            tem = '任选四';
        }else if('rxwu' == tem) {
            tem = '任选五';
        }
        $("#lotTypeName").text($("#lotName").val()+ '-' + tem + '条件');
    }
    // 获取Session中的条件
    $.post(
        "https://www.cjcp.com.cn/zoushitu/common/session.php",
        {type:'getCon', lotType:lot},
        function(data) {
            if (data != null && data != '') {
                //alert(JSON.stringify(data));
                var count = 0;
                $('.yjrtj_box').append('<table class="yjrtj_table" id="content_table"></table>');

                $.each(data, function(k) {
                    //alert(data[k].key + '  ' + data[k].val);
                    count++;
                    var value = data[k].val;
                    var arrTemp = value.split('#@#');
                    var newRow = '<tr>';
                    newRow += '<td width="40" class="txtc"><input type="checkbox" name="ckbcon"/>&nbsp;<span>' + count + '</span></td>';
                    newRow += '<td width="80" class="txtc"><input type="hidden" value="' + arrTemp[2] + '"/>' + arrTemp[0] + '</td>';
                    newRow += '<td><span class="tjnr" title="' + arrTemp[1] + '">' + catchStrWithNoMore(arrTemp[1], 30) + '</span></td>';
                    newRow += '<td width="40" class="txtc"><span class="del_ico" onclick="delTr(this)"><input type="hidden" value="'+ data[k].key + '"/></span></td>';
                    newRow += '</tr>';

                    $("#content_table").append(newRow);
                });
                $('#conditionCount').text(count);
            }
        },
        'json'
    );
    /******************************************************/

    // 控制滚动条位置,一打开就显示到下面
    // scrollYPostion ：页面底部到导航按钮的高度
    // document.body.clientHeight            ：BODY对象高度
    // document.documentElement.clientHeight ：可见区域高度
    // 1615 ：指的是以Chrome的document.body.clientHeight为标准(每个页面都不一样)
    // 809  ：指的是以Chrome的document.documentElement.clientHeight为标准(这是固定的)
    scrollYPostion = scrollYPostion + (document.body.clientHeight - bodyClientHeight - 22) + (809 - document.documentElement.clientHeight);
    /*20190705 seo需求：现页面打开后会跳到预测文章模块，改为从首屏开始；*/
    //window.scrollTo(0, scrollYPostion);
    //alert(document.body.clientHeight);
});

/**
 * 判断是否是IE浏览器
 */
function isIE() {
    //indexOf() 若找到, 返回大于0; 若没有找到,则返回 -1 。
    if (window.navigator.userAgent.toString().toLowerCase().indexOf("msie") >= 1) {
        return true;
    } else {
        return false;
    }
}

/**
 * 获取浏览器类型及版本
 */
function getBrowserType() {

    var OsObject = "";
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.split(";")[1].toLowerCase().indexOf("msie 6.0") > 0) {
            return "IE6";
        } else if (navigator.userAgent.split(";")[1].toLowerCase().indexOf("msie 7.0") > 0) {
            return "IE7";
        } else if (navigator.userAgent.split(";")[1].toLowerCase().indexOf("msie 8.0") > 0) {
            return "IE8";
        } else if (navigator.appName == "Microsoft Internet Explorer" && (navigator.appVersion.match(/9./i) == "9.")) {
            return "IE9";
        } else if (navigator.appName == "Microsoft Internet Explorer" && document.documentMode == 10) {
            return "IE10";
        } else if (navigator.appName == "Microsoft Internet Explorer" && document.documentMode == 11) {
            return "IE11";
        }
    } else if (navigator.userAgent.indexOf("Firefox") > 0) {
        return "Firefox";
    } else if (navigator.userAgent.indexOf("Chrome") > 0) {
        return "Chrome";
    } else if (navigator.userAgent.indexOf("Safari") > 0) {
        return "Safari";
    } else if (navigator.userAgent.indexOf("Camino") > 0) {
        return "Camino";
    } else if (navigator.userAgent.indexOf("Gecko/") > 0) {
        return "Gecko";
    }
}

/**
 * 判断对象是否为一个数组
 */
function isArray(obj) {
    return (typeof obj == 'object') && obj.constructor == Array;
}

/**
 * 在数组中找出某项的索引
 */
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

/**
 * 删除数组中的某项
 */
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

/**
 * 数组排序方法
 */
function sortFunction(x, y) {
    if (x.indexOf('-') > 0) {
        x = (x.split('-'))[0];
    }
    if (y.indexOf('-') > 0) {
        y = (y.split('-'))[0];
    }

    return parseInt(x) - parseInt(y);
}

/**
 * 截取一定长度字符串，后面加。。。
 */
function catchStrWithNoMore(strValue, strlength) {

    var length = getBytesCount(strValue);
    if (length > strlength) {
        strValue = strValue.substr(0, strlength);
        if (strValue.substr(strlength - 1, strlength) == ",") {
            strValue= strValue.substr(0, strlength - 1);
        }
        strValue = strValue + "...";
    }
    return strValue;
}

/**
 * 求字符串的长度
 */
function getBytesCount(str) {
    if (str == null) {
        return 0;
    } else {
        return (str.length + str.replace(/[\u0000-\u00ff]/g, "").length);
    }
}

/**
 * 画线处理
 */
function drawLine(tbodyId, startIndex, len, cssName, lineColor) {

    oZXZ.clear();
    //分析参数
    var indexParam = getArrayFormString(startIndex);
    var lenParam = getArrayFormString(len);
    var cssParam = getCssArrayFormString(cssName);
    var colorParam = getArrayFormString(lineColor);

    //加载线
    objectZXZ = oZXZ.bind(tbodyId, cssParam);
    for (var i = 0; i < indexParam.length; i++) {
        objectZXZ.add(indexParam[i], 0, lenParam[i], 0, colorParam[i], lineIndent);
    }
    objectZXZ.draw(true);
}

/**
 * 分析参数
 */
function getArrayFormString(param) {
    //分析参数
    var returnArray = new Array();
    if (param != "" && param != undefined) {
        //有线的情况
        if (param.indexOf(",") > 0) {
            //有多条线的情况
            returnArray = param.split(",");
        } else {
            //只有一条线的情况
            returnArray[0] = param;
        }
    }
    return returnArray;
}

/**
 * 分析CSS
 */
function getCssArrayFormString(param) {
    //分析参数
    var returnArray = new Array();
    var cssParamTemp = new Array();
    if (param != "" && param != undefined) {
        //有线的情况
        if (param.indexOf(",") > 0) {
            //有多条线的情况
            cssParamTemp = param.split(",");
        } else {
            //只有一条线的情况
            cssParamTemp[0] = param;
        }
    }
    countIndex = 0;
    for (var i = 0; i < cssParamTemp.length; i++) {
        returnArray[countIndex] = cssParamTemp[i];
        countIndex = countIndex + 1;
        returnArray[countIndex] = cssParamTemp[i] + ' border_left';
        countIndex = countIndex + 1;
    }
    return returnArray;
}

/**
 * 隐藏或显示折线
 */
function showBrokenLine(object) {

    if ($(object).attr("class") == 'ckbox') {
        showLine = true;
        $(object).attr("class", 'ckbox_hover');
        $('#dzxUp').attr("class", 'ckbox_hover');
        $('#dzxDown').attr("class", 'ckbox_hover');
    } else {
        showLine = false;
        $('#dzxUp').attr("class", 'ckbox');
        $('#dzxDown').attr("class", 'ckbox');
    }
    //分析参数
    var indexParam = getArrayFormString(startIndex);
    var lenParam = getArrayFormString(len);
    var cssParam = getCssArrayFormString(cssName);
    var colorParam = getArrayFormString(lineColor);

    if (showLine) {
        //显示线
        oZXZ.clear();
        //重新加载线
        objectZXZ = oZXZ.bind(tbodyId, cssParam);
        for (var i = 0; i < indexParam.length; i++) {
            objectZXZ.add(indexParam[i], 0, lenParam[i], 0, colorParam[i]);
        }
        objectZXZ.draw(true);
    } else {
        //隐藏线
        oZXZ.clear();
    }
}

/**
 * 判断是否是升序还是降序
 */
function isSortOrNot() {
    var tbody = document.getElementById(tbodyId);
    var isSort = false;
    if (tbody.rows.length > 0) {
        //var value = tbody.rows[0].cells[0].innerHTML;
        var value = $('#pagedata tr:first td:eq(0)').text();
        if (value == "1") {
            isSort = false;
        } else {
            isSort = true;
        }
    }
    return isSort;
}

/**
 * 描述：遗漏分层
 * 给当前页面的遗漏分层
 */
function missLayering(object){

    //取当前的TBody
    var vtablebb =document.getElementById(tbodyId);
    //取得当前的排序
    var isSort = isSortOrNot(tbodyId);
    //分析参数
    var startParam = getArrayFormString(missStartIndex);
    var endParam = getArrayFormString(missLen);
    // console.log(startParam);
    for (var i = 0; i < endParam.length; i++) {
        endParam[i] = parseInt(startParam[i]) + parseInt(endParam[i]);
    }
    var cssParam = getArrayFormString(missStyle);
    for (var i = 0; i < cssParam.length; i++) {
        cssParam[i] = cssParam[i] + ' border_left';
    }
    var cssStyle = cssParam.join(',');
    if ($(object).attr("class") == 'ckbox') {
        $('#ylfcUp').attr("class", 'ckbox_hover');
        $('#ylfcDown').attr("class", 'ckbox_hover');
        //开始列,结束列,是否Check,是否排序
        ylfcDisplayOrnot(tbodyId, startParam, endParam, 1, isSort, cssStyle);
    } else {
        $('#ylfcUp').attr("class", 'ckbox');
        $('#ylfcDown').attr("class", 'ckbox');
        ylfcDisplayOrnot(tbodyId, startParam, endParam, 2, isSort, cssStyle);
    }
}

/**
 * 在table的指定范围内  zhouec 2010/06/10
 * tableid:表Body的id
 * begincol:开始列数组
 * endcol:结束列数组
 * showflag: 1显示 2隐藏
 * cssStyle: 特殊处理的单元格的样式的字符串
 */
function ylfcDisplayOrnot(tableId, begincol, endcol, showflag, isSort, cssStyle){
    // 取得当前TBody控件
    var vtablebb = document.getElementById(tableId);
    var beginrow = vtablebb.rows.length - 1;
    var endrow = -1;

    if (!isSort) {
        //降序时
        if (showflag == 1) {
            //显示
            for (var k = 0; k < begincol.length; k++) {
                for (var j = parseInt(begincol[k]); j < parseInt(endcol[k]); j++) {
                    for (var i = beginrow; i > endrow; i--) {
                        var tmp = vtablebb.rows[i].cells[j];
                        if (cssStyle.indexOf(tmp.className) < 0) {
                            if (tmp.innerHTML != "")
                                break;
                        } else {
                            tmp.style.backgroundColor = '#9999CC';
                        }
                    }
                }
            }
        } else {
            //隐藏
            for (var i = beginrow; i > endrow; i--) {
                for (var k = 0; k < begincol.length; k++) {
                    for (var j = parseInt(begincol[k]); j < parseInt(endcol[k]); j++) {
                        var tmp = vtablebb.rows[i].cells[j];
                        tmp.style.backgroundColor="";
                    }
                }
            }
            //执行断区
            if($("#dqxsUp").attr("class") == 'ckbox_hover')
            {
                $('#dqxsUp').attr("class", 'ckbox');
                showDuanqu($("#dqxsUp"));
            }
        }
    } else {
        //升序时
        if (showflag == 1) {
            //显示
            for (var k = 0; k < begincol.length; k++) {
                for (var j = parseInt(begincol[k]); j < parseInt(endcol[k]); j++) {
                    for (var i = endrow + 1; i <= beginrow; i++) {
                        var tmp = vtablebb.rows[i].cells[j];
                        if (cssStyle.indexOf(tmp.className) < 0) {
                            if (tmp.innerHTML != "")
                                break;
                        } else {
                            tmp.style.backgroundColor = '#9999CC';
                        }
                    }
                }
            }
        } else {
            //隐藏
            for (var i = endrow + 1; i <= beginrow; i++) {
                for (var k = 0; k < begincol.length; k++) {
                    for (var j = parseInt(begincol[k]); j < parseInt(endcol[k]); j++) {
                        var tmp = vtablebb.rows[i].cells[j];
                        if(tmp.style.backgroundColor == 'rgb(153, 153, 204)')
                        {
                            tmp.style.backgroundColor="";
                        }
                    }
                }
            }
            //执行断区
            if($("#dqxsUp").attr("class") == 'ckbox_hover')
            {
                $('#dqxsUp').attr("class", 'ckbox');
                showDuanqu($("#dqxsUp"));
            }
        }
    }
}

/**
 * 显示遗漏数据
 */
var my_array;
function showMissData(object){

    var tbody = document.getElementById(tbodyId);
    var trs = tbody.rows;

    //分析参数
    var startParam = getArrayFormString(missStartIndex);
    var endParam = getArrayFormString(missLen);
    for (var i = 0; i < endParam.length; i++) {
        endParam[i] = parseInt(startParam[i]) + parseInt(endParam[i]);
    }
    var cssParam = getArrayFormString(missStyle);
    for (var i = 0; i < cssParam.length; i++) {
        cssParam[i] = cssParam[i] + ' border_left';
    }
    var cssStyle = cssParam.join(',');

    var showMiss = false;
    if ($(object).attr("class") == 'ckbox') {
        showMiss = false;
        $(object).attr("class", 'ckbox_hover');
        $('#bdylsjUp').attr("class", 'ckbox_hover');
        $('#bdylsjDown').attr("class", 'ckbox_hover');
    } else {
        showMiss = true;
        $('#bdylsjUp').attr("class", 'ckbox');
        $('#bdylsjDown').attr("class", 'ckbox');
    }

    //取得当前的排序
    var isSort = isSortOrNot(tbodyId);


    if (!isSort) {

        /******************************************************************/
        var rowCount = trs.length;
        /******************************************************************/
        if(!showMiss){
            //不带遗漏数据
            var k = 0;
            my_array = new Array();
            for (var i = 0; i < rowCount; i++) {
                for (var n = 0; n < startParam.length; n++) {
                    for (var j = parseInt(startParam[n]); j < parseInt(endParam[n]); j++) {
                        var tmp = trs[i].cells[j];
                        //判断是否是一个球
                        if (cssStyle.indexOf(tmp.className) < 0) {
                            continue;
                        } else {
                            k++;
                            tdAreaDisplayOrnot(i, j, 1, k);
                        }
                    }
                }
            }
        } else {
            var k=0;
            //my_array = new Array();
            for(var i = 0; i < rowCount; i++){
                for (var n = 0; n < startParam.length; n++) {
                    for (var j = parseInt(startParam[n]); j < parseInt(endParam[n]); j++) {
                        var tmp = trs[i].cells[j];
                        if (cssStyle.indexOf(tmp.className) < 0) {
                            continue;
                        } else {
                            k++;
                            tdAreaDisplayOrnot(i, j, 2, k);
                        }
                    }
                }
            }
        }
    } else {

        /******************************************************************/
        var rowCount = trs.length;
        /******************************************************************/
        if (!showMiss) {
            //不带遗漏数据
            var k = 0;
            my_array = new Array();
            for (var i = rowCount - 1; i >= 0; i--){
                for (var n = 0; n < startParam.length; n++) {
                    for (var j = parseInt(startParam[n]); j < parseInt(endParam[n]); j++) {
                        var tmp = trs[i].cells[j];
                        //判断是否是一个球
                        if(cssStyle.indexOf(tmp.className) < 0){
                            continue;
                        }else{
                            k++;
                            tdAreaDisplayOrnot(i, j, 1, k);
                        }
                    }
                }
            }
        } else {
            var k=0;
            //my_array = new Array();
            for (var i = rowCount - 1; i >= 0; i--) {
                for (var n = 0; n < startParam.length; n++) {
                    for (var j = parseInt(startParam[n]); j < parseInt(endParam[n]); j++) {
                        var tmp = trs[i].cells[j];
                        if (cssStyle.indexOf(tmp.className) < 0) {
                            continue;
                        } else {
                            k++;
                            tdAreaDisplayOrnot(i, j, 2, k);
                        }
                    }
                }
            }
        }
    }
}


/**
 * 隐藏或显示辅助线
 */
function showAssistLine(object) {

    var trs =document.getElementById(tbodyId).rows;
    var showLine = false;
    if ($(object).attr("class") == 'ckbox') {
        showLine = false;
        $('#fzxUp').attr("class", 'ckbox_hover');
        $('#fzxDown').attr("class", 'ckbox_hover');
    } else {
        showLine = true;
        $('#fzxUp').attr("class", 'ckbox');
        $('#fzxDown').attr("class", 'ckbox');
    }

    //取得当前的排序
    var isSort = isSortOrNot(tbodyId);
    if (!isSort) {
        if (showLine) {
            for (var i = 0; i < trs.length; i++) {
                $(trs[i]).removeClass('border_top');
            }
        } else {
            for (var i = 0; i < trs.length; i++) {
                if (i % 5 == 0) {
                    $(trs[i]).addClass('border_top');
                }
            }
        }
    } else {
        if (showLine) {
            for (var i = 0; i < trs.length; i++) {
                $(trs[i]).removeClass('border_top');
            }
        } else {
            for (var i = trs.length - 1; i >= 0; i--) {
                if (i % 5 == 0) {
                    $(trs[i]).addClass('border_top');
                }
            }
        }
    }
    // 有折线时重新画线
    if (hasZhexian == true) {
        //分析参数
        var indexParam = getArrayFormString(startIndex);
        var lenParam = getArrayFormString(len);
        var cssParam = getCssArrayFormString(cssName);
        var colorParam = getArrayFormString(lineColor);

        if ($('#dzxUp').attr("class") == 'ckbox_hover'
            && startIndex != undefined && startIndex != null && startIndex != "" ) {
            oZXZ.clear();
            objectZXZ = oZXZ.bind(tbodyId, cssParam);
            for (var i = 0; i < indexParam.length; i++) {
                objectZXZ.add(indexParam[i], 0, lenParam[i], 0, colorParam[i]);
            }
            objectZXZ.draw(true);
        }
    }
}

/**
 * 在table的指定范围内 做显示或隐藏操作
 */
function tdAreaDisplayOrnot(row, col, showflag, k){

    var vtablebb = document.getElementById(tbodyId);
    var tmp = vtablebb.rows[row].cells[col];
    if (showflag == 1) {
        //隐藏
        my_array[k] = tmp.innerHTML;
        tmp.innerHTML = "&nbsp;";
    } else {
        tmp.innerHTML = my_array[k];
    }
}

/**
 * 鼠标划过变背景色
 */
function mouseHoverColor(obj) {
    $(obj).addClass("over").bind("mouseout", function(){
        $(this).removeClass("over");
    });
}

/**
 * 排序
 */
function pageSort() {
    
    var tbody = document.getElementById(tbodyId);
    var colRows = tbody.rows;
    var aTrs = new Array;

    //循环所有的行
    for (var i = 0; i < colRows.length; i++) {
        //取得该行数据，赋值给数组
        aTrs[i] = colRows[i];
        if (aTrs[i].className == "border_top") {
            aTrs[i].className = "border_top";
        }
    }

    if(aTrs != null && aTrs.length > 0){
        //反转数组
        aTrs.reverse();

        var strSrc = $('#imageSort').attr('src');
        var srcArray = strSrc.split("/");
        //alert(srcArray[srcArray.length - 1]);
        var srcDir = "";
        for (var i = 0; i < srcArray.length - 1; i++) {
            srcDir = srcDir + srcArray[i] + "/";
        }
        if (srcArray[srcArray.length - 1] == "dot_sort1.gif") {
            $('#imageSort').attr('src', srcDir + 'dot_sort2.gif');
        } else {
            $('#imageSort').attr('src', srcDir + 'dot_sort1.gif');
        }

        var oFragment = document.createDocumentFragment();
        for (var i=0; i < aTrs.length; i++) {
            oFragment.appendChild(aTrs[i]);
        }
        tbody.appendChild(oFragment);
    }

    if (startIndex != undefined && startIndex != null && startIndex != "") {
        //分析参数
        var indexParam = getArrayFormString(startIndex);
        var lenParam = getArrayFormString(len);
        var cssParam = getCssArrayFormString(cssName);
        var colorParam = getArrayFormString(lineColor);
        //把页面上的线清空
        oZXZ.clear();
        if ($('#dzxUp').attr("class") == 'ckbox_hover') {
            //重新加载线
            objectZXZ = oZXZ.bind(tbodyId, cssParam);
            for (var i = 0; i < indexParam.length; i++) {
                objectZXZ.add(indexParam[i], 0, lenParam[i], 0, colorParam[i]);
            }
            objectZXZ.draw(true);
        }
    }
}

/**
 * 显示或隐藏统计数据的后两行
 */
function showOrHideLastTwoLines(type, action, obj) {

    var trId1 = '#cur_pjyl';
    var trId2 = '#cur_dqyl';
    var trId3 = '#c500_pjyl';
    var trId4 = '#c500_dqyl';
    var trId5 = '#c1000_pjyl';
    var trId6 = '#c1000_dqyl';
    var trId7 = '#his_pjyl';
    var trId8 = '#his_dqyl';

    //var trId1 = '#' + type + '_pjyl';
    //var trId2 = '#' + type + '_dqyl';
    //var divId = '#' + type + 'div';
    var divId1 = '#curdiv';
    var divId2 = '#c500div';
    var divId3 = '#c1000div';
    var divId4 = '#hisdiv';



    if (action == 'up') {
        $(trId1).hide();
        $(trId2).hide();
        $(trId3).hide();
        $(trId4).hide();
        $(trId5).hide();
        $(trId6).hide();
        $(trId7).hide();
        $(trId8).hide();
        $(divId1).attr("class", "jt_ico_xx");
        $(divId2).attr("class", "jt_ico_xx");
        $(divId3).attr("class", "jt_ico_xx");
        $(divId4).attr("class", "jt_ico_xx");
    } else {
        $(trId1).show();
        $(trId2).show();
        $(trId3).show();
        $(trId4).show();
        $(trId5).show();
        $(trId6).show();
        $(trId7).show();
        $(trId8).show();
        $(divId1).attr("class", "jt_ico_no");
        $(divId2).attr("class", "jt_ico_no");
        $(divId3).attr("class", "jt_ico_no");
        $(divId4).attr("class", "jt_ico_no");
    }
}

/**
 * 期号输入框的Check
 */
function submitQihaoSearch(type) {

    var pageHtml = $('#pageHtml').val();
    var startQi = '';
    var endQi = '';
    var objId = '';
    if (type == '1') {
        startQi = $('#qiStartUp').val();
        endQi = $('#qiEndUp').val();
        objId = 'qiEndUp';
    } else {
        startQi = $('#qiStartDown').val();
        endQi = $('#qiEndDown').val();
        objId = 'qiEndDown';
    }
    var regex = new RegExp('20[0-9]{5}');
    if (startQi.length != 7 || endQi.length != 7){
        alert('期号输入不正确！');
        $('#' + objId).focus();
        return false;
    }
    if (!regex.test(startQi)) {
        alert("开始期数输入的不正确，请重新输入!");
        $('#' + objId).focus();
        return false;
    }
    if (!regex.test(endQi)) {
        alert("结束期数输入的不正确，请重新输入!");
        $('#' + objId).focus();
        return false;
    }
    var typeId = $('#tp').val();
    if (typeId != '' && typeId != undefined) {
        typeId = '_' + typeId;
    }
    //window.location.href = pageHtml + typeId + '-1-' + startQi + '-' +  endQi + '.html';
    var params = {
        "stq": startQi,
        "enq": endQi,
        "st":1,
    };
    httpPost(pageHtml + typeId+'.html', params);
}
//发送POST请求跳转到指定页面
function httpPost(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";

    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        temp.appendChild(opt);
    }

    document.body.appendChild(temp);
    temp.submit();

    return temp;
}
/**
 * 鼠标滑过已选条件(购物车)按钮
 */
function showConditions() {

    document.onmouseover = function(event){
        var e = event || window.event;
        var elem = e.srcElement || e.target;
        while (elem) {
            try {
                //alert($(elem).attr('id'));
                if (typeof($(elem).attr('id')) != 'undefined' && ($(elem).attr('id') == 'yxztj' || $(elem).attr('id') == 'yxztj_fl')) {
                    // 如何当前坐标在层上则返回
                    $('#yxztj').addClass('hover');
                    $("#yxztj_fl").show();
                    return;
                } else {
                    $('#yxztj').removeClass('hover');
                    $("#yxztj_fl").hide();
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

/**
 * 加入已选条件(购物车)
 */
function addFilterCommon(contents, conFilter) {

    var pageId = $('#pageHtml').val();
    var strType = $('#conditionName').val();
    var lot = $('#lotteryId').val();

    /****************************************************************************/
    // 加入购过滤条件动态效果
    var $target = $('.jrgl_btn');
    var $shop = $('#yxztj');
    var x = $target.offset().left;
    var y = $target.offset().top + 10;
    var X = $shop.offset().left + $shop.width() / 2 - $target.width() / 2 + 10;
    var Y = $shop.offset().top - 30;

    if ($('#fly_order').length <= 0) {
        $('body').append('<div id="fly_order"></div')
    };
    var $obj = $('#fly_order');

    if(!$obj.is(':animated')){
        $obj.css({'left': x, 'top': y}).animate({'left': X, 'top': Y}, 500, function() {
            $obj.fadeOut(50, function(){
                $obj.remove();
            });
        });
    }
    /****************************************************************************/

    /****************************************************************************/
    // 获取选择的条件
    var arrContents = new Array();
    var arrConFilter = new Array();
    var length = 1;
    if (isArray(contents) == true) {
        arrContents = contents;
        arrConFilter = conFilter;
        length = contents.length;
    } else {
        arrContents[0] = contents;
        arrConFilter[0] = conFilter;
    }
    /****************************************************************************/

    var conditionCount = $('#conditionCount').text();
    var pageConditionNum = parseInt(conditionCount);
    var rowNum = pageConditionNum + length;
    $('#conditionCount').text(rowNum);

    var arrConKey = new Array();
    var newRow = '';
    var starIndex = 0;
    var rowIndex = 0;

    if (pageConditionNum == 0) {
        // 没有条件
        $('.yjrtj_box').append('<table class="yjrtj_table" id="content_table"></table>');

        newRow = getConditionDetailHtml(1, strType, arrContents[0], arrConFilter[0], pageId + '1');
        $('#content_table').append(newRow);

        arrConKey.push(pageId + '1');

        starIndex = 1;
    }
    for (var i = starIndex; i < length; i++) {
        rowIndex = pageConditionNum + i + 1;
        newRow = getConditionDetailHtml(rowIndex, strType, arrContents[i], arrConFilter[i], pageId + rowIndex);
        $("#content_table tr:last").after(newRow);

        arrConKey.push(pageId + rowIndex);
    }

    /******************************************************/
    $('#yucehang tr:eq(0)').find('td').each(function (i) {
        $(this).find('span').each(function() {
            className = $(this).attr('class');
            if (className != undefined && className.indexOf('_click') > 0) {
                $(this).attr('class', className.replace('_click', ''));
            }
        });
    });
    /******************************************************/

    // 把该条件存入Session中
    var arrConContents = new Array();
    for (i = 0; i < length; i++) {
        arrConContents.push(strType + '#@#' + arrContents[i] + '#@#' + arrConFilter[i]);
    }
    var conContents = arrConContents.join('*@*');
    //alert(conContents);

    if (lot == '11x5') {
        /***************************************************************/
        // 高频彩需区分地区和形态
        // 如果是11选5和时时彩，需要区分是哪个地区
        if ($('#area').length > 0) {
            lot = lot + '-' + $('#area').val();
        }
        // 如果是11选5和时时彩，需要区分形态（11选5：前一，前二，前三，任二-任八；时时彩：二星，三星）
        if ($('#filterZbName').length > 0 && $('#filterZbName').val() != "") {
            lot = lot + '-' + $('#filterZbName').val().substr(0, 4);
        }
        /***************************************************************/
    }
    $.post(
        "../common/session.php",
        {type:'add', lotType:lot, conKey:arrConKey.join('*@*'), conContent:conContents},
        function(data) {
            if (data != null && data != '') {
                //alert(JSON.stringify(data));
            }
        },
        'json'
    );
    /******************************************************/
}

/**
 * 获取选择条件明细行的HTML
 */
function getConditionDetailHtml(rowNum, strType, strContents, strConFilter, conKey) {

    var newRow = '<tr>';
    newRow += '<td width="40" class="txtc"><input type="checkbox" name="ckbcon"/>&nbsp;<span>' + rowNum + '</span></td>';
    newRow += '<td width="80" class="txtc"><input type="hidden" value="' + strConFilter + '"/>' + strType + '</td>';
    newRow += '<td><span class="tjnr" title="' + strContents + '">' + catchStrWithNoMore(strContents, 30) + '</span></td>';
    newRow += '<td width="40" class="txtc"><span class="del_ico" onclick="delTr(this)"><input type="hidden" value="' + conKey + '"/></span></td>';
    newRow += '</tr>';

    return newRow;
}

/**
 * 删除已选条件(购物车)中的行
 */
function delTr(object) {

    //if (!confirm('确定要删除此条件?')) {
    //    return;
    //}

    $(object).parent().parent().remove();

    var conditionCount = $('#conditionCount').text();
    var rowNum = parseInt(conditionCount) - 1;
    $('#conditionCount').text(rowNum);

    //重新设置序号，从1开始
    for (var i = 0; i < rowNum; i++) {
        $('#content_table tbody tr:eq('+i+') td:eq(0)').children('span').text((i + 1) + '');
    }

    /******************************************************/
    // 删除Session中的当前条件
    var conKey = $(object).children('input').val();
    var lot = $('#lotteryId').val();
    //alert(conKey);

    if (lot == '11x5') {
        /***************************************************************/
        // 高频彩需区分地区和形态
        // 如果是11选5和时时彩，需要区分是哪个地区
        if ($('#area').length > 0) {
            lot = lot + '-' + $('#area').val();
        }
        // 如果是11选5和时时彩，需要区分形态（11选5：前一，前二，前三，任二-任八；时时彩：二星，三星）
        if ($('#filterZbName').length > 0 && $('#filterZbName').val() != "") {
            lot = lot + '-' + $('#filterZbName').val().substr(0, 4);
        }
        //alert(lot);
        /***************************************************************/
    }
    $.post(
        "../common/session.php",
        {type:'del', lotType:lot, conKey:conKey},
        function(data) {
            if (data != null && data != '') {
                //alert(JSON.stringify(data));
            }
        },
        'json'
    );
    /******************************************************/
}

/**
 * 全选已选条件(购物车)中行的CheckBox
 */
function selectAll() {
    $('[name="ckbcon"]:checkbox').attr('checked', true);
}

/**
 * 清空已选条件(购物车)中所有行的CheckBox
 */
function clearAll() {
    $('[name="ckbcon"]:checkbox').attr('checked', false);
}

/**
 * 删除已选条件(购物车)中选中的行
 */
function deleteAll() {

    var ckbs = $('input[name="ckbcon"]:checked');
    if (ckbs.size() == 0) {
        alert("请选择要删除的条件！");
        return;
    } else {
        if (!confirm('确定要删除选中的条件?')) {
            return;
        }
    }
    var conKeys = '';
    var obj = null;
    var count = 0;
    ckbs.each(function(){
        obj = $(this).parent().parent().find('input:last');
        conKeys += (obj.val() + '#@#');
        $(this).parent().parent().remove();
        count++;
    });

    $('#conditionCount').text(parseInt($('#conditionCount').text()) - count);

    // 对序号重新排序
    var trcount = $("table[id$='content_table']>tbody").children('tr').length;
    for (var i = 1; i < trcount; i++) {
        // 更新页面上的序号
        $('#content_table tbody tr:eq(' + i + ') td:eq(0)').children('span').text((i + 1) + '');
    }

    /******************************************************/
    // 删除Session中的该彩种中的所有条件
    conKeys = conKeys.substr(0, conKeys.length - 3);

    var lot = $('#lotteryId').val();
    if (lot == '11x5') {
        /***************************************************************/
        // 高频彩需区分地区和形态
        // 如果是11选5和时时彩，需要区分是哪个地区
        if ($('#area').length > 0) {
            lot = lot + '-' + $('#area').val();
        }
        // 如果是11选5和时时彩，需要区分形态（11选5：前一，前二，前三，任二-任八；时时彩：二星，三星）
        if ($('#filterZbName').length > 0 && $('#filterZbName').val() != "") {
            lot = lot + '-' + $('#filterZbName').val().substr(0, 4);
        }
        /***************************************************************/
    }
    $.post(
        "../common/session.php",
        {type:'delAll', lotType:lot, conKey:conKeys},
        function(data) {
            if (data != null && data != '') {
                //alert(JSON.stringify(data));
            }
        },
        'json'
    );
    /******************************************************/
}

/**
 * 把已选条件(购物车)带入到过滤页面
 */
function toFilterPage() {

    var conditionCount = $('#conditionCount').text();

    //重新设置序号，从1开始
    var condition = '';
    for (var i = 0; i < conditionCount; i++) {
        if (i == conditionCount - 1) {
            condition = condition + $('#content_table tbody tr:eq('+i+') td:eq(1)').children('input').val();
        } else {
            condition = condition + $('#content_table tbody tr:eq('+i+') td:eq(1)').children('input').val() + '#';
        }
    }
    //alert(condition);

    // 提交Form到双色球过滤工具
    //document.getElementById('t').value = condition;
    $('#t').val(condition);
    //$('#f').val('1');
    var lot = $('#lotteryId').val();
    if(lot=="cjwssq"){
        lot = 'ssq';
    }else if(lot=="cjwdlt"){
        lot = 'dlt';
    }else if(lot=="cjw11x5"){
        lot = '11x5';
    }
    var param = '';
    if ($('#area').length > 0) {
        var area = 'sd';
        var areaId = $('#area').val();
        switch (areaId) {
            case 'shandong':
                area = 'sd';
                break;
            case 'shanghai':
                area = 'sh';
                break;
            case 'beijing':
                area = 'bj';
                break;
            case 'hebei':
                area = 'hb';
                break;
            case 'jiangsu':
                area = 'js';
                break;
            case 'chongqing':
                area = 'cq';
                break;
            case 'anhui':
                area = 'ah';
                break;
            case 'guangdong':
                area = 'gd';
                break;
            case 'jiangxi':
                area = 'jx';
                break;
            case 'heilongjiang':
                area = 'hlj';
                break;
            case 'jilin':
                area = 'jl';
                break;
            case 'ningxia':
                area = 'nx';
                break;
        }
        param = '?area=' + area;
    }
    document.fcForm.action = 'http://tool.cjcp.com.cn/' + lot + '/' + param;
    document.fcForm.submit();
}

/**
 * 鼠标滑过高级筛选按钮，加载IFRAME
 */
function gjsxOnclick(iframeId, divId) {

    // 初始化高级筛选页面上的按钮
    initSubPage(iframeId);

    var lottery = $('#lotteryId').val();
    var gjsxHtml = 'gjsx';


    // 加载Iframe
    if ($('#' + iframeId).attr('src') == '') {
        $('#' + iframeId).attr('src', '../gjsx/' + gjsxHtml + '.html?v=12');
        //iframeLoaded(document.getElementById(iframeId), loadedCallback, divId);
    }
    // console.log($('#' + iframeId).attr('src'));
    var headFoot = divId[divId.length-1];
    if (headFoot == 'U') {
        if (arrOnclick[2] == 0 ) {
            $("#" + divId).addClass("hover");
            closeQishuSearch('qs_set2','qs_set2');
            closeQishuSearch('qs_set','qs_set');
            closeFootDh();
            arrOnclick[2] = 1;
        } else {
            closeGjxSearch('gj_set',divId);
            arrOnclick[2] = 0;
        }
    } else {
        if (arrOnclick[4] == 0 ) {
            $("#" + divId).addClass("hover");
            closeQishuSearch('qs_set2','qs_set2');
            closeQishuSearch('qs_set','qs_set');
            closeFootDh();
            arrOnclick[4] = 1;
        } else {
            closeGjxSearch('gj_set2',divId);
            arrOnclick[4] = 0;
        }
    }
}

/**
 * 判断Iframe是否加载完成
 */
function iframeLoaded(iframeObject, callback, divId) {

    if (iframeObject.attachEvent) { // IE
        iframeObject.attachEvent("onload", function() {
            if (callback && typeof(callback) == "function") {
                callback(divId);
            }
        });
    } else { // 非IE
        iframeObject.onload = function() {
            if (callback && typeof(callback) == "function") {
                callback(divId);
            }
        }
    }
}

/**
 * 加载完Iframe后的回调函数
 */
function loadedCallback(divId) {
    $('#' + divId).remove();
}

/**
 * 初始化页面
 */
function initSubPage(iframeId) {

    var gjqs = $('#gjqs').val();
    if (gjqs == '') {
        gjqs = $('#allCount').val();
    }

    var myDate = new Date();
    var yearEnd = myDate.getFullYear();
    var yearStart = 2003;
    var lottery = $('#lotteryId').val();
    if (lottery == 'ssq') {
        // 双色球数据从2003年开始
        yearStart = 2003;
    } else if (lottery == 'dlt') {
        // 大乐透数据从2007年开始
        yearStart = 2007;
    } else if (lottery == '11x5') {
        // 11选5数据
        // 高频彩种
        yearStart = 2008;
        // 高频彩种的高级筛选的默认期数为5000期
        gjqs = 5000;
    }

    $(window.frames[iframeId].document).find('#qishu').val(gjqs);
    initSelectedWeek(iframeId);
    initSelected(iframeId, 'year', $('#year', parent.document).val(), yearStart, yearEnd);
    initSelected(iframeId, 'month', $('#month', parent.document).val(), 1, 12);
    initSelected(iframeId, 'day', $('#day', parent.document).val(), 1, 31);
    initSelected(iframeId, 'dayYinli', $('#dayYinli', parent.document).val(), 1, 30);
    initSelectedWeishu(iframeId);
}

/**
 *  初始化选中按钮
 */
function initSelected(iframeId, objId, value, start, end) {

    // 先清空所有选中项
    for (var i = start; i <= end; i++) {
        $(window.frames[iframeId].document).find('#' + objId + i).attr('class', 'qssz_btn');
    }
    // 设置选中的项
    if (value != '') {
        var arrTemp = value.split(',');
        for (i = 0; i < arrTemp.length; i++) {
            $(window.frames[iframeId].document).find('#' + objId + arrTemp[i]).attr('class', 'qssz_btn_in');
        }
    }
    // 同时更新子页面的值
    $(window.frames[iframeId].document).find('#' + objId).val(value);
}

/**
 *  初始化星期选中按钮
 */
function initSelectedWeek(iframeId) {

    var lottery = $('#lotteryId').val();
    var arrWeekVal = new Array('2', '4', '0');
    if (lottery == 'ssq') {
        arrWeekVal = new Array('2', '4', '0');
    } else if (lottery == 'dlt') {
        arrWeekVal = new Array('1', '3', '6');
    } else if (lottery == '11x5') {
        arrWeekVal = new Array('1', '2', '3', '4', '5', '6', '0');
    }
    // 先清空所有选中项
    for (var i = 0; i < arrWeekVal.length; i++) {
        $(window.frames[iframeId].document).find('#week' + arrWeekVal[i]).attr('class', 'qssz_btn');
    }
    // 设置选中的项
    var value = $('#week', parent.document).val();
    if (value != undefined && value != null && value != '') {
        var arrTemp = value.split(',');
        for (i = 0; i < arrTemp.length; i++) {
            $(window.frames[iframeId].document).find('#week' + arrTemp[i]).attr('class', 'qssz_btn_in');
        }
    }
    // 同时更新子页面的值
    $(window.frames[iframeId].document).find('#week').val(value);
}

/**
 *  初始化尾数选中按钮
 */
function initSelectedWeishu(iframeId) {

    // 先清空所有选中项
    for (i = 0; i < 10; i++) {
        $(window.frames[iframeId].document).find('#weishu' + i).attr('class', 'wscx_btn');
        for (var j = 0; j < 10; j++) {
            $(window.frames[iframeId].document).find('#weishu' + j + i).attr('class', 'wscx_btn_fl');
        }
    }
    // 设置选中的项
    var value = $('#weishu', parent.document).val();
    if (value != '') {
        var arrTemp = value.split(',');
        var wei = '';
        for (i = 0; i < arrTemp.length; i++) {
            $(window.frames[iframeId].document).find('#weishu' + arrTemp[i]).attr('class', 'wscx_btn_fl_in');

            wei = arrTemp[i].substr(0, 1);
            $(window.frames[iframeId].document).find('#weishu' + wei).attr('class', 'wscx_btn_in');
        }
    }
    // 同时更新子页面的值
    $(window.frames[iframeId].document).find('#weishu').val(value);
}

/**
 * 鼠标滑过历史统计按钮的处理
 */
function lstjMouseOver() {

    document.onmouseover = function(event) {
        var e = event || window.event;
        var elem = e.srcElement || e.target;
        while (elem) {
            try {
                if (typeof($(elem).attr('id')) != 'undefined' && ($(elem).attr('id') == 'lstj' || $(elem).attr('id') == 'lstj_fl')) {
                    // 如何当前坐标在层上则返回
                    $('#lstj').addClass('hover');
                    $('#lstj_fl').show();
                    return;
                } else {
                    $('#lstj').removeClass('hover');
                    $('#lstj_fl').hide();
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

/**
 * 展示统计数据行
 */
function showTongjiTbody(object, tbodyId) {
    $('#lstj').html($(object).text());
    $('#currentstate').hide();
    $('#c500state').hide();
    $('#c1000state').hide();
    $('#historystate').hide();
    $('#' + tbodyId).show();
}

/**
 * 展开预测行
 */
function diplayYucehang() {
    for (var i = 0; i < 1; i++) {
        $('#yucehang tr:eq(0)').after($('#yucehang tr:eq(0)').clone(true));
    }
    var trObject = $('#yucehang tr');
    var length = trObject.length;
    var arrLabel = new Array('预测行');
    var tdObj = null;
    for (i = 0; i < 2; i++) {
        tdObj = trObject.eq(i).children().eq(0);
        if (i != 1) {
            tdObj.html('<div class="jt_ico_no">' + arrLabel + '</div>');
        } else {
            // tdObj.html('<div class="jt_ico_ss" onclick="packupYucehang();">预测行</div>');
        }
        if (i != 0) {
            tdObj.removeClass('border_t');
        }
    }
    length = $('#yucehang tr:eq(0) td').length;
    var trObjTemp = null;
    for (i = 1; i < 2; i++) {
        trObjTemp = trObject.eq(i);
        trObjTemp.attr('class', 'ych_td2');
        // 清空这一行的样式
        for (var j = 1; j < length; j++) {
            classTd = '';
            if (arrBleft.indexOf(j) != -1) {
                classTd = 'border_left';
            }
            if (hasAddFilter && j == length - 1) {
                classTd += ' border_r';
            }
            tdObj = trObjTemp.children().eq(j);
            tdObj.attr('class', classTd);
            //tdObj.children('span').removeClass();
            var spanClass = tdObj.children('span').attr('class');
            if (spanClass != undefined && spanClass != null) {
                spanClass = spanClass.replace('_click', '');
                tdObj.children('span').attr('class', spanClass);
            }
        }
    }
}

/**
 * 收起预测行
 */
function packupYucehang() {

    $('#yucehang tr:eq(0) td:eq(0)').html('<div class="jt_ico_xx" onclick="diplayYucehang();">预测行</div>');
    // 删除预测行二是预测行五
    for (var i = 1; i < 2; i++) {
        $('#yucehang tr:eq(1)').remove();
    }
}

/**
 * 打印开奖数据
 */
function printPage() {

    window.print();
    //$('#container').printArea();
    /*var bdhtml = window.document.body.innerHTML;//获取当前页的html代码
    var sprnstr = '<!--startprint-->';          //设置打印开始区域
    var eprnstr = '<!--endprint-->';            //设置打印结束区域
    var prnhtml = bdhtml.substring(bdhtml.indexOf(sprnstr) + 17); //从开始代码向后取html
    prnhtml = prnhtml.substring(0,prnhtml.indexOf(eprnstr));      //从结束代码向前取html

    window.document.body.innerHTML = prnhtml;
    window.print();
    window.document.body.innerHTML = bdhtml;*/
}

/**
 * 计算N个里出M个的注数
 * n ：号码数
 * m ：出的个数
 */
function getZhushu(n, m) {

    var fenmu = 1;
    for (var i = n; i > n - m; i--) {
        fenmu *= i;
    }

    var fenzi = 1;
    for (i = 1; i <= m; i++) {
        fenzi *= i;
    }

    return fenmu / fenzi;
}

/**
 * 打开期数设置
 */
function openQishuSearch(divId) {
    var headFoot = divId[divId.length-1];
    if (headFoot == 't') {
        if (arrOnclick[1] == 0 ) {
            $("#" + divId).addClass("hover");
            closeFootDh();
            closeGjxSearch('gj_set','gjsxDivU');
            closeGjxSearch('gj_set2','gjsxDivD');
            arrOnclick[1] = 1;
        } else {
            closeQishuSearch(divId,divId);
        }
    } else {
        if (arrOnclick[3] == 0 ) {
            $("#" + divId).addClass("hover");
            closeFootDh();
            closeGjxSearch('gj_set','gjsxDivU');
            closeGjxSearch('gj_set2','gjsxDivD');
            arrOnclick[3] = 1;
        } else {
            closeQishuSearch(divId,divId);
        }
    }

}

/**
 * 打开走势图底部导航
 */
function openFootDh() {
    if (arrOnclick[0] == 0 ) {
        $("#zst_name" ).addClass("hover");
        $("#zst_name_c" ).addClass("hover");
        closeQishuSearch('qs_set','qs_set')
        closeQishuSearch('qs_set2','qs_set2');
        closeGjxSearch('gj_set','gjsxDivU');
        closeGjxSearch('gj_set2','gjsxDivD');
        arrOnclick[0] = 1;
    } else {
        closeFootDh();
    }
}

/**
 * 关闭期数设置
 */
function closeQishuSearch(cla, divId) {
    var headFoot = divId[divId.length-1];
    $("#" + divId).attr("class", cla);
    if (headFoot == 't') {
        arrOnclick[1] = 0;
    } else {
        arrOnclick[3] = 0;
    }
}

/**
 * 关闭高级筛选
 */
function closeGjxSearch(cla, divId) {
    var headFoot = divId[divId.length-1];
    $("#" + divId).attr("class", cla);
    if (headFoot == 'u') {
        arrOnclick[2] = 0;
    } else {
        arrOnclick[4] = 0;
    }
}

/**
 * 关闭底部导航
 */
function closeFootDh() {
    $("#zst_name").attr("class", "zst_name");
    $("#zst_name_c").attr("class", "hand");
    arrOnclick[0] = 0;
}

/**
 * 导航标红
 */
function navMarkRed() {
    var pageHtml = $('#pageHtml').val();
    var pageTypeId = $('#tp').val();
    if($('#pageNavHtml').length > 0 && $('#pageNavHtml').val() != ""){
        pageHtml = $('#pageNavHtml').val();
    } else {
        pageHtml = $('#pageHtml').val();
    }
    var navId = pageTypeId == "" ? pageHtml : pageHtml + "-" + pageTypeId ;
    $('#' + navId).attr("class", "font_red_b");
}

/**
 * 断区显示
 */
function showDuanqu(object) {
    //取当前的TBody
    var tbody =document.getElementById(tbodyId);
    var trs = tbody.rows;
    //分析参数
    var startParam = getArrayFormString(duanquStartIndex);
    var endParam = getArrayFormString(duanquLen);
    for (var i = 0; i < endParam.length; i++) {
        endParam[i] = parseInt(startParam[i]) + parseInt(endParam[i]);
    }
    var cssParam = getArrayFormString(duanquStyle);
    for (var i = 0; i < cssParam.length; i++) {
        cssParam[i] = cssParam[i] + ' border_left';
    }
    var cssStyle = cssParam.join(',');

    var showMiss = false;
    if ($(object).attr("class") == 'ckbox') {
        showMiss = false;
        $('#dqxsUp').attr("class", 'ckbox_hover');
        $('#dqxsDown').attr("class", 'ckbox_hover');
    } else {
        showMiss = true;
        $('#dqxsUp').attr("class", 'ckbox');
        $('#dqxsDown').attr("class", 'ckbox');
    }
    /******************************************************************/
    var rowCount = trs.length;
    /******************************************************************/
    if (!showMiss) {
        //断行显示
        for (var i = 0; i < rowCount; i++) {
            for (var n = 0; n < startParam.length; n++) {
                var k = 0;
                //判断此分区是否有出号
                for (var j = parseInt(startParam[n]); j < parseInt(endParam[n]); j++) {
                    var tmp = trs[i].cells[j];
                    if (cssStyle.indexOf(tmp.className) >= 0) {
                        k++;
                    }
                }
                if (k <= 0) {
                    for (var j = parseInt(startParam[n]); j < parseInt(endParam[n]); j++) {
                        var tmp = trs[i].cells[j];
                        tmp.style.backgroundColor = '#AAAAAA';
                    }
                }
            }
        }
    } else {
        //断行隐藏
        for (var i = 0; i < rowCount; i++) {
            for (var n = 0; n < startParam.length; n++) {
                //判断此分区是否有出号
                for (var j = parseInt(startParam[n]); j < parseInt(endParam[n]); j++) {
                    var tmp = trs[i].cells[j];
                    tmp.style.backgroundColor="";
                }
            }
        }
    }
    //执行遗漏分层
    if ($("#ylfcUp").attr("class") == 'ckbox_hover') {
        $('#ylfcUp').attr("class", 'ckbox');
        missLayering($("#ylfcUp"));
    }
}

/**
 * 关闭弹出框
 */
function closeWeeBoxs() {
    $.weeboxs.close();
}

function dj(i){
    $('.bottom2 .n_tab_title a').removeClass('n_on').eq(i).addClass('n_on');
    $('.bottom2 .n_tabcons .n_tabcon').hide().eq(i).show();
}