//rem设定start
//使用rem前设定html font-size:100px;尺寸计算方法，测量设计稿像素尺寸/100=rem；
function resize(){
    rootE=document.documentElement;
    rootE.style.fontSize=rootE.clientWidth/6.4+"px";//1rem=100px;
}
//rem设定 end

//加载头部 start
function loadHF() {
    $("#load_header").load("header.html");
    $("#load_footer").load("footer.html");
}
//加载头部 end

//获取url地址 start
function getRequest(){
    var com_url = {};
    var url_seacrch = location.search; //获取url地址？之后的所有内容；
    var url_href = location.href; //获取url地址
    var url_path = location.pathname; //返回 URL 的路径名
    var url_host = window.location.host; //获取主域地址
    //对url地址？之后的所有内容进行处理，拆分；
    if(url_seacrch.indexOf('?')!=-1){
        var str = url_seacrch.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            com_url[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    com_url["url_href"]=url_href;
    com_url["url_path"]=url_path;
    com_url["url_host"]=url_host;
    return com_url;
}
//获取url地址 end

//ajax获取数据 start
function ajax(url){
    var res = null;
    var url_main = getRequest();
    $.ajax({
        url:"http://"+url_main.url_host+url,
        type:'GET',
        async:false,
        success:function(data){
            res = data;
        }
    })
    return res;
}
//ajax获取数据 end

//详情页图片地址拼接 start
function splic_path(obj){   //obj 传类名、id名；如：$(".class img")、$("#id img");
    var url_main = getRequest();
    var length = obj.length,
        src = '';
    for(var i=0;i<length;i++){
        src = obj.eq(i).attr('src');
        obj.eq(i).attr('src',url_main+src);
    }
}
//详情页图片地址拼接 end

//翻页 start
    (function($){
        var zp = {
            init:function(obj,pageinit){
                return (function(){
                    zp.addhtml(obj,pageinit);
                    zp.bindEvent(obj,pageinit);
                }());
            },
            addhtml:function(obj,pageinit){
                return (function(){
                    obj.empty();
                    /*上一页*/
                    if (pageinit.current > 1) {
                        obj.append('<a href="javascript:;" class="prebtn">上一页</a>');
                    } else{
                        obj.remove('.prevPage');
                        obj.append('<span class="disabled">上一页</span>');
                    }
                    /*中间页*/
                    if (pageinit.current >4 && pageinit.pageNum > 4) {
                        obj.append('<a href="javascript:;" class="zxfPagenum">'+1+'</a>');
                        obj.append('<a href="javascript:;" class="zxfPagenum">'+2+'</a>');
                        obj.append('<span>...</span>');
                    }
                    if (pageinit.current >4 && pageinit.current <= pageinit.pageNum-5) {
                        var start  = pageinit.current - 2,end = pageinit.current + 2;
                    }else if(pageinit.current >4 && pageinit.current > pageinit.pageNum-5){
                        var start  = pageinit.pageNum - 4,end = pageinit.pageNum;
                    }else{
                        var start = 1,end = 9;
                    }
                    for (;start <= end;start++) {
                        if (start <= pageinit.pageNum && start >=1) {
                            if (start == pageinit.current) {
                                obj.append('<span class="current">'+ start +'</span>');
                            } else if(start == pageinit.current+1){
                                obj.append('<a href="javascript:;" class="zxfPagenum nextpage">'+ start +'</a>');
                            }else{
                                obj.append('<a href="javascript:;" class="zxfPagenum">'+ start +'</a>');
                            }
                        }
                    }
                    if (end < pageinit.pageNum) {
                        obj.append('<span>...</span>');
                    }
                    /*下一页*/
                    if (pageinit.current >= pageinit.pageNum) {
                        obj.remove('.nextbtn');
                        obj.append('<span class="disabled">下一页</span>');
                    } else{
                        obj.append('<a href="javascript:;" class="nextbtn">下一页</a>');
                    }
                    /*尾部*/
                    obj.append('<span>'+'共'+'<b>'+pageinit.pageNum+'</b>'+'页，'+'</span>');
                    obj.append('<span>'+'到第'+'<input type="number" class="zxfinput" value="1"/>'+'页'+'</span>');
                    obj.append('<span class="zxfokbtn">'+'确定'+'</span>');
                }());
            },
            bindEvent:function(obj,pageinit){
                return (function(){
                    obj.on("click","a.prebtn",function(){
                        var cur = parseInt(obj.children("span.current").text());
                        var current = $.extend(pageinit, {"current":cur-1});
                        zp.addhtml(obj,current);
                        if (typeof(pageinit.backfun)=="function") {
                            pageinit.backfun(current);
                        }
                    });
                    obj.on("click","a.zxfPagenum",function(){
                        var cur = parseInt($(this).text());
                        var current = $.extend(pageinit, {"current":cur});
                        zp.addhtml(obj,current);
                        if (typeof(pageinit.backfun)=="function") {
                            pageinit.backfun(current);
                        }
                    });
                    obj.on("click","a.nextbtn",function(){
                        var cur = parseInt(obj.children("span.current").text());
                        var current = $.extend(pageinit, {"current":cur+1});
                        zp.addhtml(obj,current);
                        if (typeof(pageinit.backfun)=="function") {
                            pageinit.backfun(current);
                        }
                    });
                    obj.on("click","span.zxfokbtn",function(){
                        var cur = parseInt($("input.zxfinput").val());
                        var current = $.extend(pageinit, {"current":cur});
                        zp.addhtml(obj,{"current":cur,"pageNum":pageinit.pageNum});
                        if (typeof(pageinit.backfun)=="function") {
                            pageinit.backfun(current);
                        }
                    });
                }());
            }
        }
        $.fn.createPage = function(options){
            var pageinit = $.extend({
                pageNum : 15,
                current : 1,
                backfun : function(){}
            },options);
            zp.init(this,pageinit);
        }
    }(jQuery));
//翻页 end
//返回顶部 start
function reTop(top){
    $("#retop").click(function(){
        $('html , body').animate({scrollTop: 0},500);
    })
    if(top!=-1){
        $("#retop").css("display","none");
    }
    $(window).scroll(function(){
        var num_top = $(window).scrollTop();
        if(num_top>top){
            $("#retop").fadeIn(500);
        }else{
            $("#retop").fadeOut(500);
        }
    })
}
//返回顶部 end
//超出变...隐藏 start
function over_hid(string,num){
    if(string.length>num){
        string=string.substring(0,num);
        string = string+"...";
        return string;
    }
    return string;
}
//超出变...隐藏 end

//判断加载 start
function pc_or_warp(){
    var MobileUA = (function() {
        var ua = navigator.userAgent.toLowerCase();
 
        var mua = {
            IOS: /ipod|iphone|ipad/.test(ua), //iOS
            IPHONE: /iphone/.test(ua), //iPhone
            IPAD: /ipad/.test(ua), //iPad
            ANDROID: /android/.test(ua), //Android Device
            WINDOWS: /windows/.test(ua), //Windows Device
            TOUCH_DEVICE: ('ontouchstart' in window) || /touch/.test(ua), //Touch Device
            MOBILE: /mobile/.test(ua), //Mobile Device (iPad)
            ANDROID_TABLET: false, //Android Tablet
            WINDOWS_TABLET: false, //Windows Tablet
            TABLET: false, //Tablet (iPad, Android, Windows)
            SMART_PHONE: false //Smart Phone (iPhone, Android)
        };
 
        mua.ANDROID_TABLET = mua.ANDROID && !mua.MOBILE;
        mua.WINDOWS_TABLET = mua.WINDOWS && /tablet/.test(ua);
        mua.TABLET = mua.IPAD || mua.ANDROID_TABLET || mua.WINDOWS_TABLET;
        mua.SMART_PHONE = mua.MOBILE && !mua.TABLET;
 
        return mua;
    }());
 
    //SmartPhone 
    if (MobileUA.SMART_PHONE) {
        // 移动端链接地址
        document.location.href = './wap/index.html';
    }else{
        document.location.href = './pc/index.html';
    }
}
//判断加载 end

//swiper初始化 start
function swiper_privatization(name,atplay){
    name = "."+name;
    if(atplay ==0){
        atplay = false;
    }else{
        atplay = true;
        $(name).hover(function(){
            swiper.autoplay.stop();
        },function(){
            swiper.autoplay.start();
        })
    }
    var swiper = new Swiper(name, {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: atplay,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
    });
}
//swiper初始化 end

//滚动 start
function sakiRoll(time){
    $("#box_view").css({
        "width":"100%",
        "height":"100%",
        "position":"relative",
        "overflow":"hidden"
    })
    $("#box_inside").css({
        "float":"left",
        "margin-right":"20px;"
    })
    var width_view = $("#box_view").outerWidth(true);  //获取视图宽度
    var height_view = $("#box_view").outerHeight(true);  //获取视图高度
    var width = $("#box_inside").outerWidth(true); //获取内层盒子宽度
    var height = $("#box_inside").outerHeight(true); //获取内层盒子高度
    var num_marginTop = -height/2;   //计算上下居中定位踢动距离
    var num_width = width*2;  // 计算外层盒子宽度
    var num_width_count = 2;  // 外层盒子与内层盒子比例计数
    var num_safe = 0; //安全计数，防止递归函数无限循环；
    var num = 0;  //移动计数
    $("#box_outside").append($("#box_inside").clone());  //复制并添加内层盒子
    function width_count(){   //递归函数，通过递归函数达成滚动条件，即外层盒子宽度大于视图宽度
        if(num_width<=width_view*1.5){
            num_width_count++;
            num_width = width*num_width_count;
            $("#box_outside").append($("#box_inside").clone());
            num_safe++;
            if(num_safe<1000){
                width_count();
            }
        }
    }
    width_count();
    //初始化外层盒子的css
    $("#box_outside").css({
        "margin-top":num_marginTop,
        "width":num_width+10,
        "position":"absolute",
        "top":"50%"
    });
    var timer = setInterval(function(){
        num++;
        if(num<width){
            $("#box_outside").css("transform","translate(-"+num+"px,0)");
        }else{
            num=0;
        }
    },time)
    $("#box_view").hover(function(){
        clearInterval(timer)
    },function(){
        timer = setInterval(function(){
        num++;
        if(num<width){
            $("#box_outside").css("transform","translate(-"+num+"px,0)");
        }else{
            num=0;
        }
    },time)
    })
}
//滚动 end
//选项卡 start
function choose_card(){
    var saki_num_lock = 0;
    $(".choose_con>p").click(function(){
        $(".choose_con>p").removeClass("choose_change");
        $(this).addClass("choose_change");
        var num_index = $(this).index()/2;   // 0,1,2,3
        if(num_index==saki_num_lock){
            return;
        }
        $(".main_content").hide().eq(num_index).fadeIn(500);
        saki_num_lock = num_index;
    })
}
choose_card()
//选项卡 end