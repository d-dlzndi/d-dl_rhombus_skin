var scrollList = [];

document.addEventListener("DOMContentLoaded", function () {
    $("#all").addClass("loaded");

    var linkHref = $(location).attr('href');
    var listTarget = $("#main-content-list-type");
    var txtadd = "&nbsp;&nbsp;&nbsp;";
    var listTxt = "";
    if (linkHref.indexOf("/tag") != -1) {
        listTxt = txtadd + '<i class="fas fa-hashtag"></i>';
    } else if (linkHref.indexOf("/search") != -1) {
        listTxt = txtadd + '<i class="fas fa-search"></i>';
    } else if (linkHref.indexOf("/category/") != -1 && linkHref.indexOf("/category/?page=") == -1) {
        listTxt = txtadd + '<i class="fas fa-bars"></i>';
    } else if (linkHref.indexOf("/category") != -1) {
        listTxt = '◆';
    }

    if (listTxt != null) listTarget.html(listTxt);

    //////// each
    $(".ms-list a").each(function () {
        var origHref = $(this).attr("href");
        if (linkHref.indexOf(origHref) !== -1) {
            if (origHref == "/category") {
                var link = linkHref.substr(linkHref.length - origHref.length);
                if (link == origHref || linkHref.indexOf(origHref + "/?") !== -1)
                    $(this).addClass("selected");
            } else if (origHref == "/") {
                return false;
            } else {
                var link = linkHref.substr(linkHref.length - origHref.length);
                $(this).addClass("selected");
            }
            $(this).parent(".sub_category_list").addClass("selected");
        }
    });

    $(".for-rh-title").each(function () {
        var origHref = encodeURI($(this).attr("href"));
        if (linkHref.indexOf(origHref) !== -1) {
            if (origHref == "/category") {
                var link = linkHref.substr(linkHref.length - origHref.length);
                if (link == origHref || linkHref.indexOf(origHref + "/?") !== -1)
                    $(this).addClass("selected");
            } else if (origHref == "/") {
                return false;
            } else {
                $(this).addClass("selected");
            }
        }
    });

    $(".list-thumbnail").each(function () {
        var cc = $(this).attr("src");
        if (cc == null || cc == "") {
            $(this).parent(".list-thumb").css("display", "none");
            $(this).parent(".list-thumb").next(".list-text").css("width", "100%");
        }
    });

    $('.tagbox').each(function () {
        var comma = $(this).html();
        $(this).html(comma.replace(/,/g, ''));
    });

    $(".turnAni").each(function (index) {
        $(this).on('click', function (e) {
            $(".turnAni").eq(index).addClass('active');
            setTimeout(function () {
                $(".turnAni").eq(index).removeClass('active');
            }, 100);
        });
    });

    $(".list-commentCount").each(function () {
        var tt = $(this).children(".ct");
        var ct = tt.text();
        if (ct == "(0)" || ct == null || ct == "") $(this).css({
            "display": "none"
        });
        else tt.html(ct.substr(1, ct.length - 2));
    });

    $(".list-lock").each(function () {
        if ($(this).attr("description") == "보호되어 있는 글입니다.")
            $(this).html('<i class="fas fa-lock"></i><br>');
    });

}); // document ready end

 $(window).on('load', function () {
    var utl = $("#main-sidebar-bg-img").attr("defaultBg");

    var scrollListActive = false;
    scrollList[0] = 0;
    if ($("*[changeBg]").length > 1) {
        for (i = 1; i <= $("*[changeBg]").length; i++)
            scrollList[i] = $("*[changeBg]").eq(i - 1).offset().top - 50;
        scrollListActive = true;
    } else {
        var ttx = $("*[changeBg]").eq(0).attr("changeBg");
        if (ttx != null && ttx != "null")
            ChangeBGDefault(ttx);
        else
            ChangeBGDefault(utl);
    }

    if (defaultBgUrl == null)
        ChangeBGDefault(utl);

    if ($("#content-index #index").length > 0)
        makeIndex();

    ScrollAllEvent(scrollListActive, $(window).scrollTop());

    $(window).scroll(function () {
        ScrollAllEvent(scrollListActive, $(this).scrollTop());
    });

    // 덤. 썸네일 이미지 미리 로딩
    $("*[changeBg]").each(function () {
        var img = new Image();
        img.onload = function () {
            //console.log(img.src + " 로딩 완료");
        }
        img.src = $(this).attr("changeBg");
    });
    
}); // window load end

function ScrollAllEvent(scrollListActive, scrollt) {
    if (scrollListActive && $("#main-sidebar-bg-img").length > 0)
        ScrollEvent(scrollt);
    if ($("#content-index #index").length > 0)
        IndexScrollEvent(scrollt);
}

function ScrollEvent(scrollt) {
    for (var num = 0; num <= scrollList.length; num++) {
        var scrollListNum = num < scrollList.length ?
            Math.ceil(scrollList[num]) : $(document).height();
        if (scrollt < scrollListNum) {
            num--;
            if (num == 0) {
                ChangeBGDefault();
            } else {
                var url = String($("*[changeBg]").eq(num - 1).attr("changeBg"));
                var txxt = "";
                if (url != "null") {
                    var target = $("#main-sidebar-bg-img");
                    var txt = target.css("background-image").split('\"');
                    txxt = String(txt[1]);
                    txxt = txxt.length > url.length ? txxt.substr(txxt.length - url.length, url.length) : txxt;
                }
                if (txxt != url) ChangeBG(url);
            }
            break;
        }
    }
}

function IndexScrollEvent(scrollt) {
    var dad = $("#content-index #index");
    var child = dad.children(".index-content");
    for (var i = 0; i <= child.length; i++) {
        var target = child.eq(i);
        var thisTop = i == child.length ? $(document).height() :
            Number(target.find(".index-act").attr("scroll")) - 50;
        if (scrollt > thisTop) continue;
        i--;
        for (var j = 0; j < child.length; j++) {
            var t = child.eq(j).find(".index-act");
            if (i != j)
                t.removeClass("active");
            else {
                if (!t.hasClass("active"))
                    t.addClass("active");
            }
        }
        break;
    }
}

//////// functions
var slideHeight = 0;

function SideToggle() {
    $("#main-sidebar").toggleClass("active");
    if ($("#main-sidebar").hasClass("active")) {
        slideHeight = $("html, body").scrollTop();
        $('html, body').addClass('dontScroll');
    } else {
        $('html, body').removeClass('dontScroll');
    }
    $("html, body").scrollTop(slideHeight);
}

var profileUrl = null;
var defaultBgUrl = $("#main-sidebar-bg-img").attr("defaultBg") || "";

function ChangeBG(url) {
    if ($("#main-sidebar-bg-img").length <= 0) return;
    if (url == null) return;
    if (url == 'null') url = defaultBgUrl;
    var target = $("#main-sidebar-bg-img");
    var txt = target.css("background-image").split('\"');
    var txxt = String(txt[1]);
    if (url)
        txxt = txxt.length > url.length ? txxt.substr(txxt.length - url.length, url.length) : txxt;
    if (txxt == url) return;

    target.addClass("change");
    setTimeout(function () {
        target.removeClass("change");
    }, 1);
    target.stop().css({
        "background-image": "url('" + url + "')"
    });
}

function ChangeBGDefault(url) {
    if ($("#main-sidebar-bg-img").length <= 0) return;
    if (profileUrl == "") {
        profileUrl = $("#profileOrigImg").attr("src").split("\'");
    }
    if (url != undefined && ((profileUrl != null && profileUrl != url) || profileUrl == null)) defaultBgUrl = url;
    ChangeBG(defaultBgUrl);
}

function addIndex(topp, name) {
    $("#content-index #index").append('<li class="index-content"><span class="index-act btn" scroll="' + topp + '" onclick="Scroll(\'' + topp + '\')"><span class="text">' + name + '</span></span></li>');
}

function makeIndex() {
    addIndex(0, "최상단");

    var articles = $(".main-all-article");
    if (articles.length > 1) {
        for (var i = 0; i < articles.length; i++) {
            var target = articles.eq(i);
            addIndex(target.find(".content-decorate").offset().top, target.find(".main-content-title a").text());
        }
    } else if (articles.length == 1) {
        var titles = $("h2, h3, h4:not(.another_category *), h5, h6, .main-content-article-tags, .main-content-article-comments").filter(".main-content *");
        for (var i = 0; i < titles.length; i++) {
            var target = titles.eq(i);
            if (target == null) continue;
            var topp = target.offset().top;
            var textt = "";
            if (target.hasClass("main-content-article-tags")) {
                textt = "태그";
            } else if (target.hasClass("main-content-article-comments")) {
                textt = "댓글";
            } else {
                textt = target.text();
            }
            addIndex(topp, textt);
        }
    } else {
        $("#content-index #index").remove();
    }
}

function Scroll(num) {
    num = Number(num);
    $("html, body").stop().animate({
        scrollTop: num
    }, 800);
}

function ScrollTop() {
    $("html, body").stop().animate({
        scrollTop: 0
    }, 1000);
}

function ScrollBottom() {
    $("html, body").stop().animate({
        scrollTop: $(document).height() - $(window).height()
    }, 1000);
}
