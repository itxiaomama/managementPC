// 预测点击
function yuceClickCom(object) {
    var className = $(object).attr('class');
    var stq = $('#startNum').val()
    var enq = $('#endNum').val()
    var d1 = (Math.ceil((new Date() - new Date(new Date().getFullYear().toString())) / (24 * 60 * 60 * 1000)) - 10).toFixed(0);
    if (d1 - 20 < 100) {
        var d2 = '0' + (d1 - 20).toFixed(0)
    }
    if (d1 - 20 < 10) {
        var d2 = '00' + (d1 - 20).toFixed(0)
    }
    var d2 = (d1 - 20).toFixed(0)
    var date = new Date()
    year = date.getFullYear()
    var probability
    if (className.indexOf('_click') > 0) {
        $(object).attr('class', className.replace('_click', ''));
    } else {
        $(object).attr('class', className + '_click');
    }
    if (!hasAddFilter || className.indexOf('_un') > 0) {
        return;
    }
    $('.addgl').show();
    $('#redYuceDiv').show();
    $('#redYuceNumDiv').show();
    var objId = '#selectRedNum';
    var label = '';
    if (className.indexOf('_blue') > 0) {
        objId = '#selectBlueNum';
    }
    var ball = $(object).text();
    var selectNum = $(objId).text();
    if (className.indexOf('_click') < 0) {
        if (selectNum == '') {
            $(objId).text(ball);
        } else {
            $(objId).text(selectNum + ',' + ball);
        }
        selectNum = $(objId).text();
        var arrTemp = selectNum.split(',');
        $(objId).text(arrTemp.sort(sortFunction).join(','));
    } else {
        var arrTemp = selectNum.split(',');
        arrTemp.remove(ball);
        $(objId).text(arrTemp.join(','));
    }
    var hongqiu = $('#selectRedNum').text();
    if (hongqiu == '') {
        $('#hongNum').text('');
    } else {
        arrTemp = hongqiu.split(',');
        var html = []
        a1 = arrTemp.toString()
        $.ajax({
            url: 'http://cp.cngiantech.com/api/cp.php?op=match',
            type: 'post',
            data: { stq: stq || year + d2, enq: enq || year + d1, red: a1 },
            success: function (res) {
                probability = res.data.probability
                console.log(res.data.periods.length)
                if (res.data.periods.length > 0) {
                    for (let i = 0; i < res.data.periods.length; i++) {
                        html.push('<label class="redbox"><span class="redtitle">' + res.data.periods[i].code + "期：</span>" + res.data.periods[i].red + '</label>')
                        var html1 = html.join('')
                    }
                } else {
                    html1 = '暂无数据'
                }
                $('#hongNum').html('(' + arrTemp.length + "个，<span class='redspan'>出现:<span>" + res.data.times + "</span>次</span>,<span class='redspan'>概率:<span>" + probability + "</span></span><span class='redspan'>%，最大遗漏：<span>" + res.data.omission + "</span>期），</span> <span class='redspan'><span>" + res.data.total + "</span>期中同时出现<span>" + a1 + "</span></span></span>的期数如下：<div class='reddiv'>" + html1 + '</div>')
            }
        })
    }
}


let numBtn = 0;
let numBtnMore = 0;
let clickTimer = 0
let randomHtml = []
let addDivArr = []


//单选
function stare() {
    let addBtnArrMore = $('.border_more .yc_ball_red_more').slice(5, $('.border_more .yc_ball_red_more').length).prevObject;
    for (var i = 0; i < addBtnArrMore.length; i++) {
        addBtnArrMore[i].style.backgroundColor = '';
        addBtnArrMore[i].style.color = '';
        addBtnArrMore[i].style.fontWeight = '';
    }
    if (!numBtn) {
        return
    }
    if (!clickThrottle()) return;
    let hongqiu = $('#selectRedNum').text();
    arrTemp = hongqiu.split(',');
    let arr = [];
    let stq = $('#startNum').val()
    let enq = $('#endNum').val()
    let starebtn = $('.stare')
    let stopbtn = $('.stop')
    var newhtmla = '';
    starebtn.hide();
    stopbtn.show();
    $('.addgl').show();
    $('#redYuceDiv').show();
    $('#redYuceNumDiv').show();
    let cut = setInterval(toggle, 50);
    setInterval(function () {
        clearInterval(cut);
    }, 9999999999999);
    $('#stopbtn').on("click", function () {
        randomHtml = []
        stopbtn.hide();
        starebtn.show();
        clearInterval(cut);
        let addDivArr = $('.add_border #yc_ball_red_1').slice(80, $('.add_border #yc_ball_red_1').length);
        addDivArr.map((item) => {
            if (addDivArr[item].className === 'yc_ball_red_click') {
                randomHtml.push(addDivArr[item].innerHTML)
            }
        })
        let newArr1 = []
        function arr2(randomHtml, spliter) {
            for (let i = 0; i < randomHtml.length;) {
                newArr1.push(randomHtml.slice(i, i += spliter))
            }
        }
        arr2(randomHtml, numBtn)
        a1 = randomHtml.toLocaleString()
        let html = '';
        let newhtmla = ''
        let dNum = 1;
        let arrNum = 0;
        for (let T = 0; T < numBtn; T++) {
            $.ajax({
                url: 'http://cp.cngiantech.com/api/cp.php?op=match',
                type: 'post',
                data: { stq: stq || year + d2, enq: enq || year + d1, red: newArr1[0][T] },
                success: function (res) {
                    probability = res.data.probability
                    if (res.data.periods.length > 0) {
                        html = ''
                        for (let j = 0; j < res.data.periods.length; j++) {
                            html += '<label class="redbox"><span class="redtitle">' + res.data.periods[j].code + "期：</span>" + res.data.periods[j].red + '</label>'
                        }
                    } else {
                        html = '暂无数据'
                    }
                    newhtmla += `<div><span>第${dNum++}组数据：</span><span class='redspan'><span>${newArr1[0][T]}</span></span>(${1}个，<span class='redspan'>出现:<span>${res.data.times}</span>次</span>,<span class='redspan'>概率:<span>${probability}</span></span><span class='redspan'>%，最大遗漏：<span>${res.data.omission}</span>期），</span> <span class='redspan'><span>${res.data.total}</span>期中出现<span>${newArr1[0][T]}</span></span></span>的期数如下：<div class='reddiv'>${html}</div></div>`
                    $('#hongNum').html(newhtmla)
                }
            })
        }
    })
}

function newClickCom(e) {
    numBtn = Number(e.id)
    numBtnMore = 0
    let addBtnArr = $('.add_border_c .yc_ball_red_c').slice(10, $('.add_border_c .yc_ball_red_c').length).prevObject;
    let addBtnArrMore = $('.border_more .yc_ball_red_more').slice(5, $('.border_more .yc_ball_red_more').length).prevObject;
    for (var i = 0; i < addBtnArrMore.length; i++) {
        addBtnArrMore[i].style.backgroundColor = '';
        addBtnArrMore[i].style.color = '';
        addBtnArrMore[i].style.fontWeight = '';
    }
    for (var i = 0; i < addBtnArr.length; i++) {
        addBtnArr[i].style.backgroundColor = '';
        addBtnArr[i].style.color = '';
        addBtnArr[i].style.fontWeight = '';
    }
    e.style.backgroundColor = "rgb(27, 27, 27)";
    e.style.color = "#fff";
    e.style.fontWeight = '700';
}

function toggle(number) {
    getRandomNum(1, 80, numBtn)
}

const getRandomNum = function (min, max, countNum) {
    let arr = [];
    function produceNum() {
        let addDivArr = $('.add_border #yc_ball_red_1').slice(80, $('.add_border #yc_ball_red_1').length);
        for (var i = 0; i < addDivArr.length; i++) {
            addDivArr[i].className = "yc_ball_red";
        }
        let num = Math.floor((Math.random() * (max - min)) + min)
        if (arr.indexOf(num) == -1) {
            arr.push(num)
        } else {
            produceNum()
        };
        if (arr.length < countNum) {
            produceNum();
        }
        arr.map((item) => {
            addDivArr[item].className = "yc_ball_red_click";
        })
    }

    produceNum()
    return arr;
};


// 多选
function stareMore(number) {
    if (!numBtn || !numBtnMore) {
        return
    }
    if (!clickThrottle()) return;
    $('#selectRedNum').html('')
    $('#hongNum').html('')
    let starebtn = $('.stareMore')
    let stopbtn = $('.stopMore')
    starebtn.hide();
    stopbtn.show();
    let addDivArr = $('.add_border #yc_ball_red_1').slice(80, $('.add_border #yc_ball_red_1').length);
    let newNumber = number ? number : numBtn;
    var newhtml = '';
    let hongqiu = $('#selectRedNum').text();
    let html = []
    let arr = [];
    let stq = $('#startNum').val()
    let enq = $('#endNum').val()
    $('.addgl').show();
    $('#redYuceDiv').show();
    $('#redYuceNumDiv').show();
    let cut = setInterval(togglemore, 50);
    setInterval(function () {
        clearInterval(cut);
    }, 9999999999999);
    newhtml = '';
    $('#stopbtnMore').on("click", function () {
        stopbtn.hide();
        starebtn.show();
        clearInterval(cut);
        setTimeout(function () {
            for (let l = 0; l < newNumber; l++) {
                for (let y = 0; y < numBtnMore; y++) {
                    produceNum();
                }
            }
            function produceNum() {
                let addDivArr = $('.add_border #yc_ball_red_1').slice(80, $('.add_border #yc_ball_red_1').length);
                for (var i = 0; i < addDivArr.length; i++) {
                    addDivArr[i].className = "yc_ball_red";
                }
                let num = Math.floor((Math.random() * (80 - 1)) + 1)
                if (arr.indexOf(num) == -1) {
                    arr.push(num)
                } else {
                    produceNum()
                };
                if (arr.length < newNumber) {
                }
                arr.map((item) => {
                    addDivArr[item].className = "yc_ball_red_click";
                })
            }
            randomHtml = []
            addDivArr.map((item) => {
                if (addDivArr[item].className === 'yc_ball_red_click') {
                    randomHtml.push(addDivArr[item].innerHTML)
                }
                let newSort = randomSort(randomHtml)
            })
            let newArr = []
            function arr2(randomHtml, spliter) {
                for (let i = 0; i < randomHtml.length;) {
                    newArr.push(randomHtml.slice(i, i += spliter))
                }
            }
            arr2(randomHtml, numBtn)

            let listNum = 1;
            for (let i = 0; i < numBtnMore; i++) {
                $.ajax({
                    url: 'http://cp.cngiantech.com/api/cp.php?op=match',
                    type: 'post',
                    data: { stq: stq || year + d2, enq: enq || year + d1, red: newArr[i].toString() },
                    success: function (res) {
                        probability = res.data.probability
                        var html1;
                        if (res.data.periods.length > 0) {
                            for (let j = 0; j < res.data.periods.length; j++) {
                                html += ' <label class="redbox"><span class="redtitle">' + res.data.periods[j].code + "期：</span>" + res.data.periods[j].red + '</label> '
                            }
                            html1 = html
                            html = ''
                        } else {
                            html1 = '暂无数据'
                        }
                        newhtml += `<div><span>第${listNum++}组数据：</span><span class='redspan'><span>${bubbling(newArr[i]).toString()}</span></span>(${numBtn}个，<span class='redspan'>出现:<span>${res.data.times}</span>次</span>,<span class='redspan'>概率:<span>${probability}</span></span><span class='redspan'>%，最大遗漏：<span>${res.data.omission}</span>期），</span> <span class='redspan'><span>${res.data.total}</span>期中同时出现<span>${newArr[i].toString()}</span></span></span>的期数如下：<div class='reddiv'>${html1}</div></div>`
                        $('#hongNum').html(newhtml)
                    }
                })
            }
            newhtml = ''
        }, 50)

    })
}
//冒泡!!!!!!!!!!
function bubbling(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        // i = 8  依次和后面的 7,6,5,4,3,2,1比较
        for (var j = i + 1; j < arr.length; j++) {
            // 如果这一轮中的某个值 比当前要比较的值小 则交换位置
            if (arr[j] < arr[i]) {
                var tmp;
                tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
        }
    }
    return arr
}
function randomSort(array) {
    let length = array.length;

    if (!Array.isArray(array) || length <= 1) return;

    for (let index = 0; index < length - 1; index++) {
        let randomIndex = Math.floor(Math.random() * (length - index)) + index;

        [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    }

    return array;
}
function newClickComMore(e) {
    numBtnMore = Number(e.id)
    let addBtnArrMore = $('.border_more .yc_ball_red_more').slice(5, $('.border_more .yc_ball_red_more').length).prevObject;
    for (var i = 0; i < addBtnArrMore.length; i++) {
        addBtnArrMore[i].style.backgroundColor = '';
        addBtnArrMore[i].style.color = '';
        addBtnArrMore[i].style.fontWeight = '';
    }
    e.style.backgroundColor = "rgb(20, 50, 20)";
    e.style.color = "#fff";
    e.style.fontWeight = '700';
}

function togglemore(numBtnMore) {
    getRandomNummore(1, 80, numBtnMore)
}

const getRandomNummore = function (min, max, countNum) {
    let arr = [];
    function produceNum() {
        let addDivArr = $('.add_border #yc_ball_red_1').slice(80, $('.add_border #yc_ball_red_1').length + 1);
        for (var i = 0; i < addDivArr.length; i++) {
            addDivArr[i].className = "yc_ball_red";
        }
        let num = Math.floor((Math.random() * (max - min)) + min)
        if (arr.indexOf(num) == -1) {
            arr.push(num)
        } else {
            produceNum()
        };
        if (arr.length < countNum) {
            produceNum();
        }
        arr.map((item) => {
            addDivArr[item].className = "yc_ball_red_click";
        })
    }

    produceNum()
    return arr;
};


// 节流
function clickThrottle(interval = 3000) {
    let now = +new Date();
    let timer = clickTimer;
    if (now - timer < interval) {
        return false;
    } else {
        clickTimer = now;
        return true;
    }
}





