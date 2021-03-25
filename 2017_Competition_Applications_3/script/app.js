var src = {
    js : ["script/jquery-1.12.3.js", "script/jquery-ui-1.11.4/jquery-ui.js"],
    css : ["script/jquery-ui-1.11.4/jquery-ui.css"]
}

for ( i = 0, len = src.css.length; i < len; i ++) {
    var link = document.createElement("link")
    link.href = src.css[i];
    link.rel = "stylesheet";
    document.head.appendChild(link)
}

function loadScript( src,callback) {
    var script = document.createElement("script")
    script.onload = callback;
    script.src = src;
    document.head.appendChild(script)
}

var ScriptIndex = 0;
loadScript( src.js[ScriptIndex], function callback () {
    ScriptIndex++;
    if ( ScriptIndex === src.js.length ) {
        pageJs();
    }else {
        loadScript( src.js[ScriptIndex], callback)
    }
});

function pageJs() {
    jQuery(function ($) {
        //메뉴 스크롤
        $('.gnb > ul > li > a').on('click', function () {
            var data = $(this).data("menu")
            // console.log(data)
            var scroll = $('.' + data).offset().top;
            // console.log(scroll)
            $('html, body').animate({scrollTop: scroll + 'px'}, 750)
        })

        //이미지 슬라이드
        var $slide = $('#slider');
        $slide.parent().css("height","auto");
        var $slideWrapper = $('<div>').css({
            position : 'relative',
            overflow : 'hidden'
        }).appendTo($slide)
        var $sliderList = $('<ul>').css({
            position:'relative',
            width: '100%',
            'white-space' : 'nowrap'
        }).appendTo($slideWrapper)
        var $slideNav = $('<nav>').css({
            position : 'absolute',
            width : '100%',
            bottom : '40px',
            'text-align' : "center"
        }).appendTo($slideWrapper)
        var $slideRightBtn = $("<button>").html('<svg width="50px" height="87px"><polygon fill="#FFFFFF" points="50,0 25.5,0 0,43.416 25.5,86.831 50,86.831 25.5,43.416 "/></svg>').css({
            display : 'inline-block',
            background : 'none',
            border : 0,
            'vertical-align' : 'top'
        }).appendTo($slideNav)
        var $slideLeftBtn = $("<button>").html('<svg width="50px" height="87px"><polygon fill="#FFFFFF" points="50,0 25.5,0 0,43.416 25.5,86.831 50,86.831 25.5,43.416 "/></svg>').css({
            display : 'inline-block',
            background : 'none',
            border : 0,
            transform : "scaleX(-1)",
            'vertical-align' : 'top',
            'margin-left' : '50px'
        }).appendTo($slideNav)
        var ImageIndex = ['images/slide1.png','images/slide2.png','images/slide3.png']
        $.each(ImageIndex, function (i, img) {
            var $slideItem = $('<li>').css({
                display: 'inline-block',
                'vertical-align' : 'top',
                width: '100%'
            })
            var $sliderItemImage = $('<img>').css({
                display : 'block',
                width:'100%'
            }).attr('src',img).appendTo($slideItem)
            $slideItem.appendTo($sliderList)
        })

        var $slideItems = $sliderList.find('li');
        var slideCount = $slideItems.length;
        $slideItems.clone().prependTo($sliderList)
        $slideItems.clone().appendTo($sliderList)
        $sliderList.css({left : (-100 * slideCount)+ '%'});

        var SLIDE_INDEX = 0;

        function moveTo(index) {
            if ($sliderList.is(':animated')) {
                return
            }
            $sliderList.animate({left: (-100 * (index + slideCount))+ '%'},700, function () {
                index = ((((index + 1)% slideCount)+ slideCount -1)% slideCount);
                SLIDE_INDEX = index;
                $sliderList.css({left : (-100 * (index + slideCount))+ '%'})
            })
        }

        $slideRightBtn.on('click', function () {
            moveTo(SLIDE_INDEX - 1)
        })

        $slideLeftBtn.on('click', function () {
            moveTo(SLIDE_INDEX + 1)
        })
        //페렐렉스
        var $pa = $('.web_skill, .world_skills');
        $pa.find("img").css("transition", "all 600ms");
        var $window = $(window).scroll(function () {
            var top = $window.scrollTop();
            for ( var i = $pa.length; i--;) {
                var $section= $pa.eq(i);
                // console.log($section);
                var $offset = $section.offset().top;
                var Height = $section.height();
                if ( top >= $offset && top <= $offset + Height) {
                    $section.find("img").css("transform", "scale(1.5,1.5)")
                }else {
                    $section.find("img").css("transform", "scale(1,1)")
                }
            }
        })

        //read more
        $('.skill_text').append("<button href='#' class='read'>read more</button>")
        $('.read').on('click',function () {
            $(this).siblings($('.hidden_text')).slideDown();
        })

        $('.photo_img > img').on('mouseover', function () {
            $(this).css({
                "transform" : "scale(1.1,1.1)",
                "opacity" : ".3",
                "transition" : "all 600ms"
            })
        })
        $('.photo_img > img').on('mouseleave', function () {
            $(this).css({
                "transform" : "scale(1,1)",
                "opacity" : "1",
                "transition" : "all 600ms"
            })
        })

            //포토 섹션
        $('.wrapper').append("<div class='dia'></div>")
        $('.photo_img').on('click', function () {
            var src = $('.photo_img > img').attr('src')
            var rep = src.replace("images/", "");
            $('.dia').html("<img src='images/big_" + rep + "'>")
            $('.dia > img').css("width", "100%")
            $('.dia').dialog({
                modal : true,
                resizable: false,
                width:640,
                height:426,
                show : {
                    duration: 400,
                    effect:"blind"
                },
                hide : {
                    duration: 400,
                    effect:"blind"
                }
            })
        })
        
        
        //제이슨 불러오기
        $.get('../data/description.json', function (data) {
            $.each(data['WardOffice'], function (i,o) {
                var ko = o.name_ko
                $('.results').append("<p class='text'>"+ ko +"</p>")
            })
        })

        $('.results').on('click', '.text',function () {
            var text = $(this).text()
            // console.log(text)
            $.get('../data/description.json', function (data) {
                $.each(data['WardOffice'], function (i,o) {
                    var ko = o.name_ko;
                    var en = o.name_en;
                    var url = o.url;
                    var map = o.map;
                    var sq = o.square;
                    var pop = o.population;
                    var des = o.description;
                    var html = '';
                    html += "<p>"+ko+"</p>" +
                        "<p>"+en+"</p>" +
                        "<a href='" + url +"'>"+url+"</a>" +
                        "<img src='" + map + "'/>"+
                        "<p>"+sq+"</p>" +
                        "<p>"+pop+"</p>" +
                        "<p>"+des+"</p>";
                    $('.dia').html(html);
                    $('.dia > img').css("width", "100%")
                    $('.dia').dialog({
                        modal : true,
                        resizable: false,
                        width:640,
                        height:426,
                        show : {
                            duration: 400,
                            effect:"blind"
                        },
                        hide : {
                            duration: 400,
                            effect:"blind"
                        }
                    })
                })
            })
        })
    })
}