/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-07-22 01:45:56 +0200 (Son, 22 Jul 2007) $
 * $Rev: 2447 $
 *
 * Version 2.1.1
 */
(function ($) {
    $.fn.bgIframe = $.fn.bgiframe = function (s) {
        if (jQuery.browser.msie && /IE 6.0/.test(navigator.userAgent)){
//        if ($.browser.msie && /6.0/.test(navigator.userAgent)) {
            s = $.extend({ top: 'auto', left: 'auto', width: 'auto', height: 'auto', opacity: true, src: 'javascript:false;' }, s || {});
            var prop = function (n) {
                    return n && n.constructor == Number ? n + 'px' : n;
                },
                html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="' + s.src + '"' + 'style="display:block;position:absolute;z-index:-1;' + (s.opacity !== false ? 'filter:Alpha(Opacity=\'0\');' : '') + 'top:' + (s.top == 'auto' ? 'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')' : prop(s.top)) + ';' + 'left:' + (s.left == 'auto' ? 'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')' : prop(s.left)) + ';' + 'width:' + (s.width == 'auto' ? 'expression(this.parentNode.offsetWidth+\'px\')' : prop(s.width)) + ';' + 'height:' + (s.height == 'auto' ? 'expression(this.parentNode.offsetHeight+\'px\')' : prop(s.height)) + ';' + '"/>';
            return this.each(function () {
                if ($('> iframe.bgiframe', this).length == 0) {
//                    var isIE = (document.all) ? true : false;//这里仅仅简单的对是否是IE进行判断，详细浏览器判断：请参考浏览器类型侦测
//                    var ua = navigator.userAgent.toLowerCase().match("/msie ([/d.]+)/")[1];
//                    if (ua == "9.0") {
//                        isIE = false;
//                    }
//                    var oFrame = isIE ? this.insertBefore(document.createElement(html), this.firstChild) : document.createElement("iframe");
//                    oFrame.name = "iframName";
                    this.insertBefore(document.createElement(html), this.firstChild);
                }
            });
        } return this;
    };
})(jQuery);