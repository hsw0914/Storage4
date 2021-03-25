var src = {
    js : ["script/jquery-1.12.3.js","script/jquery-ui-1.11.4/jquery-ui.js"],
    css : ["script/jquery-ui-1.11.4/jquery-ui.css"]
}

for ( i = 0,len = src.css.length; i < len; i ++) {
    var link = document.createElement("link")
    link.href = src.css[i]
    link.rel = "stylesheet"
    document.head.appendChild(link)
}

function loadScript( src, callback ) {
    var script = document.createElement("script")
    script.onload = callback
    script.src = src
    document.head.appendChild(script)
}

var ScriptIndex = 0;
 loadScript(src.js[ScriptIndex], function callback () {
     ScriptIndex++;
     if (ScriptIndex === src.js.length) {
         pageJs();
     }else {
         loadScript(src.js[ScriptIndex], callback)
     }
 })

function pageJs () {
    jQuery (function ($) {

        //이미지 슬라이드 css
        var stylesheet = [
            '#slider > div{position:relative;overflow:hidden;}',
            '#slider > div > ul{position:relative;width:100%;white-space:nowrap;}',
            '#slider > div > nav{position:absolute;width:100%;bottom:40px;text-align:center;}',
            '#slider > div > nav > button{display:inline-block;vertical-align:top;background:none;border:0}',
            '#slider > div > ul > li{display:inline-block;width:100%;vertical-align:top;overflow:hidden}',
            '#slider > div > ul > li.active > img {transform:scale(1,1);opacity:1}',
            '#slider > div > ul > li > img {width:100%;display:block;transform:scale(2,2);transition:all 500ms;opacity:0}'
        ];

        $('<style>').html(stylesheet.join('\n')).appendTo('head')
        //메뉴 스크롤
        $('.gnb > ul > li > a').on('click', function () {
            var data= $(this).data("menu")
            console.log(data)
            var scroll = $('.' + data).offset().top;
            console.log(scroll)
            $('html,body').animate({scrollTop : scroll + 'px'}, 750)
        })

        //이미지 슬라이드
        var $slide = $('#slider');
        $slide.parent().css('height', 'auto')
        var $slideWrapper = $('<div>').appendTo($slide)
        var $slideList = $('<ul>').appendTo($slideWrapper)
        var $slideNav = $('<nav>').appendTo($slideWrapper)
        var $slideLeftBtn = $('<button>').html('<svg width="50px" height="87px"><polygon fill="#FFFFFF" points="50,0 25.5,0 0,43.416 25.5,86.831 50,86.831 25.5,43.416 "/></svg>').appendTo($slideNav)
        var $slideRightBtn = $('<button>').html('<svg width="50px" height="87px"><polygon fill="#FFFFFF" points="50,0 25.5,0 0,43.416 25.5,86.831 50,86.831 25.5,43.416 "/></svg>').css({
            'margin-left' : '50px',
            transform : 'scaleX(-1)'
        }).appendTo($slideNav)

        var SlideImg = ['images/slide1.png','images/slide2.png','images/slide3.png']
        $.each(SlideImg, function (i, img) {
            var $slideItem = $('<li>')
            var $slideImageItem = $('<img>').attr('src', img).appendTo($slideItem)
            $slideItem.appendTo($slideList)
        })

        var $slideItems = $slideList.find('li');
        var slideCount = $slideItems.length;
        $slideItems.clone().prependTo($slideList)
        $slideItems.clone().appendTo($slideList)+
        $slideList.css({left : (-100 * slideCount) + '%'})

        $slideItems = $slideList.find('li');

        var SLIDE_INDEX = 0;

        function moveTo (index) {
            if($slideList.is(':animated')) {
                return
            }
            var changeIndex = ((((index + 1) % slideCount) + slideCount -1 ) % slideCount)
            $slideItems.removeClass('active')
            $slideItems.filter(function (i) {
                return changeIndex === (i % slideCount);
            }).addClass('active')

            $slideList.animate({left : (-100 * ( index + slideCount )) + '%'}, 700, function () {
                index = changeIndex;
                SLIDE_INDEX = index;
                $slideList.css({left : (-100 * ( index + slideCount )) + '%'})
            })
        }

        $slideRightBtn.on('click', function () {
            moveTo(SLIDE_INDEX + 1);
        })
        $slideLeftBtn.on('click', function () {
            moveTo(SLIDE_INDEX - 1);
        })

        moveTo(0)

        //페럴렉스
        var $pa = $('.web_skill, .world_skills');
        $pa.find('img').css("transition", "all 600ms");
        var $window = $(window).scroll(function () {
            var top = $window.scrollTop();
            for ( i = $pa.length; i--; ) {
                var $section = $pa.eq(i);
                var $offset = $section.offset().top;
                var height = $section.height();
                if ( top >= $offset && top <= $offset + height) {
                    $section.find('img').css('transform', 'scale(1.5,1.5)')
                }else {
                    $section.find('img').css('transform', 'scale(1,1)')
                }
            }
        })

        //read more
        $('.skill_text').append("<button class='read'>read more</button>")
        $('.read').on('click', function () {
            $(this).siblings($('.hidden_text')).slideDown()
        })

        //photo section
        $('.photo_img > img').on('mouseover', function () {
            $(this).css({
                "transform": "scale(1.5,1.5)",
                "transition" : "all 600ms",
                "opacity" : ".3"
            })
        })

        $('.photo_img > img').on('mouseleave', function () {
            $(this).css({
                "transform": "scale(1,1)",
                "transition" : "all 600ms",
                "opacity" : "1"
            })
        })

        $('.wrapper').append("<div class='dia'></div>")
        $('.photo_img > img').on('click', function () {
            var src = $(this).attr('src')
            // console.log(src)
            var rep = src.replace('images/', '')
            $('.dia').html('<img src="images/big_' + rep + '">')
            $('.dia > img').css('width', '100%')
            $('.dia').dialog ({
                modal :true,
                width: 640,
                height : 426,
                resizable : false,
                show : {
                    duration : 1000,
                    effect : "blind"
                },
                hide : {
                    duration : 1000,
                    effect : "blind"
                }
            })
        })
        
        $.get('../data/description.json', function (data) {
            $.each(data['WardOffice'], function (i,o) {
                var ko = o.name_ko
                $('.results').append("<p class='text'>" + ko + "</p>")
            })
        })
        $('.results').on('click', '.text',function () {
            var text = $(this).text()
            console.log(text)
            $.get('../data/description.json', function (data) {
                $.each(data['WardOffice'], function (i,o) {
                    var ko = o.name_ko
                    var en = o.name_en
                    var url = o.url
                    var map = o.map
                    var sq = o.square
                    var pop = o.population
                    var des = o.description
                    var html = '';
                    if ( text === ko) {
                        html +=
                            "<p>" + ko + "</p>" +
                            "<p>" + en + "</p>" +
                            "<a href='" + url + "'>" + url + "</a>" +
                            "<img src='" + map + "'>" +
                            "<p>" + sq + "</p>" +
                            "<p>" + pop + "</p>" +
                            "<p>" + des + "</p>";

                        $('.dia').html(html)
                        $('.dia > img').css('width', '100%')
                        $('.dia').dialog({
                            modal: true,
                            width: 640,
                            height: 426,
                            resizable: false,
                            show: {
                                duration: 1000,
                                effect: "blind"
                            },
                            hide: {
                                duration: 1000,
                                effect: "blind"
                            }
                        })
                    }

                })
            })
        })
    })
}