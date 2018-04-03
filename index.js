var swiper = new Swiper('.swiper-container', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});
var iscroll = new IScroll(".content", {
    mousewheel: true,
    scrollbars: true,
    shrinkScrollbars: "scale",
    fadeScrollbars: true,
    click:true
});
var state = "project";
//点击新增
$(".add").click(function () {
    $(".mask").show();
    $(".submit").show();
    $(".update").hide();
    $(".inputarea").transition({y: 0}, 500);
})
$(".cancel").click(function () {
    $(".inputarea").transition({y: "-62vh"}, 500, function () {
        $(".mask").hide();
    });
})
$(".submit").click(function () {
    var val = $("#text").val();
    if (val === "") {
        return;
    }
    $("#text").val("");// 点击提交  设置清空
    var data = getData();
    var time = new Date().getTime();//  保存时间
    data.push({content: val, time, star: false, done: false});
    saveData(data);  //新增保存数据
    $(".inputarea").transition({y: "-62vh"}, 500, function () {
        $(".mask").hide();
        render();
    });
})
$(".project").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    state = "project";
    render();
})
$(".done").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    state = "done";
    render();
});
$(".update").click(function () {
    var val = $("#text").val();
    if (val === "") {
        return;
    }
    $("#text").val("");
    var data = getData();
    var index = $(this).data("index");
    data[index].content = val;
    saveData(data);
    $(".inputarea").transition({y: "-62vh"}, 500, function () {
        $(".mask").hide();
        render();
    });
});
$(".itemlist")
    .on("click", ".changestate", function () {
        var index = $(this).parent().attr("id");
        var data = getData();
        data[index].done = true;
        saveData(data);
        render();
    })
    .on("click", ".del", function () {
        var index = $(this).parent().attr("id");
        var data = getData();
        data.splice(index, 1);
        saveData(data);
        render();
    })
    .on("click", "span", function () {
        var index = $(this).parent().attr("id");
        var data = getData();
        data[index].star = !data[index].star;
        saveData(data);
        render();
    })
    .on("click", "p", function () {
        var index = $(this).parent().attr("id");
        var data = getData();
        $(".mask").show();
        $(".inputarea").transition({y: 0}, 500);
        $("#text").val(data[index].content);
        $(".submit").hide();
        $(".update").show().data("index", index);
    });

function getData() {
    return localStorage.todo ? JSON.parse(localStorage.todo) : [];
}

function saveData(data) {
    localStorage.todo = JSON.stringify(data);
}

//显示
function render() {
    var data = getData();
    var str = "";
    data.forEach(function (val, index) {     //val  保存的对象
        if (state === "project" && val.done === false) {
            str += "<li id=" + index + "><p>" + val.content + "</p><time>" + parseTime(val.time) + "</time><span class=" + (val.star ? "active" : "") + ">★</span><div class='changestate'>完成</div></li>"
        } else if (state === "done" && val.done === true) {
            str += "<li id=" + index + "><p>" + val.content + "</p><time>" + parseTime(val.time) + "</time><span class=" + (val.star ? "active" : "") + ">★</span><div class='del'>删除</div></li>"
        }
    });
    $(".itemlist").html(str);
    iscroll.refresh();
    addTauch();
}

function parseTime(time) {
    var date = new Date();
    date.setTime(time);
    var year = date.getFullYear();
    var month = setZero(date.getMonth() + 1);
    var day = setZero(date.getDate());
    var hour = setZero(date.getHours());
    var min = setZero(date.getMinutes());
    var sec = setZero(date.getSeconds());
    return year + "/" + month + "/" + day + "<br/>" + hour + ":" + min + ":" + sec;
}

function setZero(n) {
    return n < 10 ? "0" + n : n;
}

function addTauch() {
    $(".itemlist>li").each(function (index, ele) {
        var hammerobj = new Hammer(ele);
        var max = window.innerWidth / 5;
        var movex, sx;
        var state = "start";
        var flag = true;
        hammerobj.on("panstart", function (e) {
            // ele.style.transition="";
            sx = e.center.x;
        });
        hammerobj.on("panmove", function (e) {
            var cx = e.center.x;
            movex = cx - sx;
            if (movex > 0 && state === "start") {
                flag = false;
                return;
            }
            if (movex < 0 && state === "end") {
                flag = false;
                return;
            }
            if (Math.abs(movex) > max) {
                flag = false;
                state = state === "start" ? "end" : "start";
                if(state==="end"){
                    $(ele).css("x",-max);
                }else{
                    $(ele).css("x",0);
                }
                return;
            }
            if (state === "end") {
                movex = cx - sx - max;
            }
            flag = true;
            $(ele).css("x", movex);
        });
        hammerobj.on("panend", function () {
            if (!flag) return;
            if (Math.abs(movex) < max / 2) {
                $(ele).transition({x: 0});
                state = "start";
            } else {
                $(ele).transition({x: -max});
                state = "end";
            }
        })
    })
}

render();


//原生app
// webapp
// 混合型app（hybird  app）   html+css+js+底层接口
//微信小程序
