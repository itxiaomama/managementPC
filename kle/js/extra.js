function ofset_window(className) {
    var window_height = document.documentElement.clientHeight,
        lstj_bg = $("."+className).offset().top,
        scroll_top = lstj_bg - window_height;
    // console.log(lstj_bg);
    $("html,body").animate({scrollTop: scroll_top}, 500);
}

function front_plus(){
    $(".awards").eq(0).children('span').html("+" + $(".awards").eq(0).children('span').html());
    $(".awards1").eq(0).children('span').html("+" + $(".awards1").eq(0).children('span').html());
}
function after_plus(){
    var td_lens = $('.awards').length;
    $(".awards").eq(td_lens-1).children('span').html($(".awards").eq(td_lens-1).children('span').html() + "+" );
    $(".awards1").eq(td_lens-1).children('span').html($(".awards1").eq(td_lens-1).children('span').html() + "+" );
}

/**
 * 切换视图
 * @param obj
 * @private
 */
var narrow = document.body.offsetWidth/1560, //页面宽度
    tb_height = $("#tabledata").height();

function shitu_(obj, _w = "1600px", _h = tb_height) {

    _h = _h * narrow;

    if ($(obj).html() === '图表放大'){
        $("#container>div").eq(0).css('transform','').css('width',' 1920px');
        $("#container").css('height', 'auto');
        $(obj).html('号码全屏');
    }else{
        $("#container>div").eq(0).css('width', _w).css('transform', 'scale('+narrow+')');
        $("#container").css('height', _h);
        $(obj).html('图表放大');
    }
}

$('.jiang').on('click', function(e){
    $('span.jiang').removeClass('hao').next().hide();
    $(this).addClass('hao').next().show();
    $(document).one('click',function(){
        $('span.jiang').removeClass('hao').next().hide();
    });
    e.stopPropagation();/*stopPropagation();方法可以阻止把事件分派到其他节点*/
});

function jiang_close(x) {
    $('#pagedata td').removeClass('border1').removeClass('border2').removeClass('border3');
    $('.jiang').removeClass('hao');
    $(x).parents('div.show_phb').hide().prev().removeClass('hao');
}


function geqi_toggle(x, ge_qi){
    $('.jiang').removeClass('hao').next('.show_phb').hide();
    $('#pagedata td').removeClass('border1').removeClass('border2').removeClass('border3');

    var geqi_no = $(x).children('input.ge_no').val(),
        ge_jh = $(x).children('input.ge_jh').val(),
        this_no = $(x).children('input.this_no').val(),
        this_jh = $(x).children('input.this_jh').val(),
        param = $(x).children('input.same_num').val(),
        same_jiang = $(x).children('input.same').val(),
        this_tds_line = $(x).attr('t'),
        ge_jh_arr = [],
        this_jh_arr = [],
        same_jiang_arr = [],
        param_arr = [],
        geqi_txt = "";

    $('.l'+this_tds_line+'t'+ge_qi).eq(0).addClass('border1');
    $('.l'+this_tds_line+'t'+ge_qi).eq(1).addClass('border2');
    $('.l'+this_tds_line+'t'+ge_qi).eq(2).addClass('border3');

    if (ge_qi === 1){
        geqi_txt = "遗传位";
    }else{
        ge_qi = ge_qi - 1;
        geqi_txt = "隔"+ge_qi+"期";
    }

    ge_jh_arr = ge_jh.split(",");
    this_jh_arr = this_jh.split(",");
    same_jiang_arr = same_jiang.split(",");
    param_arr = param.split(",");

    var _htm = "<div class=\"entry\">\n" +
        "<div class=\"entry_left\"></div>\n" +
        "<p>已选："+this_no+"期，"+geqi_txt+"为"+geqi_no+"期<a href=\"javascript:;\" onclick=\"jiang_close(this);\" >×</a></p>\n" +
        "<p>统计为：";

    var _tongji_title_arr = _tongji_title.split(",");

    $.each(_tongji_title_arr, function (index, value) {
        _htm += value+"<span style='color: #ff0000;'>"+param_arr[index]+"</span>个 ";
    });

    _htm += "</p><p>"+geqi_no+"期奖号：\n";

    $.each(ge_jh_arr, function (index,value) {
        var _class = "#000000";
        if (in_array(value, same_jiang_arr)){_class = '#ff0000'}
        _htm += "<span style='color: "+_class+"'>"+value+"</span> ";
    });
    _htm += "</p><p>"+this_no+"期奖号：";
    $.each(this_jh_arr, function (index,value) {
        var _class = "#000000";
        if (in_array(value, same_jiang_arr)){_class = '#ff0000'}
        _htm += "<span style='color: "+_class+"'>"+value+"</span> ";
    });

    _htm += "</p></div>";

    $('.jh'+geqi_no).addClass('hao');
    $('.jh'+this_no).addClass('hao').next('.show_phb').html(_htm).show();
}

/**
 * 行列统计 预测选取js
 */
function tg_yx(x){
    $(x).toggleClass('bg3');
    var _num = $('.yc519').find('a.bg3').length;
    $('#yc_nums').html(_num);
}

function hanglie_click(qi_class, item, hanglie, type){

    if (item != 0){return false;}

    var _as = $('.'+qi_class).find('a');

    if (type == 'h'){
        var start_idx = hanglie*10;
        for (i=0;i<_as.length; i++){
            if (i>=start_idx && i< start_idx+10) $(_as[i]).toggleClass('bg1');
        }
    }else{
        for (i=0;i<_as.length; i++){
            var this_item = _as[i].innerHTML;
            if (this_item%10 == hanglie) $(_as[i]).toggleClass('bg1');
        }
    }

}

/**
 * 判断字符串是否存在数组
 * @param stringToSearch
 * @param arrayToSearch
 * @returns {boolean}
 */

function in_array(stringToSearch, arrayToSearch) {
    for (s = 0; s < arrayToSearch.length; s++) {
        thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;
}


