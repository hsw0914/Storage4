var src = {
    js : ["script/jquery-1.12.3.js","script/jquery-ui-1.11.4/jquery-ui.js"],
    css : ["script/jquery-ui-1.11.4/jquery-ui.css"]
}

for ( i = 0, len = src.css.length; i < len; i ++) {
    var link = document.createElement("link");
    link.rel = "stylesheet"
    link.href = src.css[i];
    document.head.appendChild(link)
}

function loadScript(src, callback) {
    var script = document.createElement("script");
    script.onload = callback
    script.src = src
    document.head.appendChild(script)
}

var IndexScript = 0;
loadScript(src.js[IndexScript], function  callback() {
    IndexScript++;
    if (IndexScript === src.js.length ) {
        pageJs();
    }else {
        loadScript(src.js[IndexScript],  callback)
    }
})

function pageJs() {
    jQuery(function ($) {
        //메뉴 스크롤
        
        $('.gnb > ul > li > a').on('click', function () {
            // var data = $(this).data("menu")
            // var data = $(this).attr('class');
            var data = $(this).html().toLowerCase().replace(' ','_');
            console.log(data)
            var scroll = $('.contnet > .' + data).offset().top;
            console.log(scroll)
            $('html,body').animate({scrollTop : scroll + 'px'}, 700)
        })

        var stylesheet = [
            '#slider > div{position:relative;overflow:hidden;}',
            '#slider > div > ul{position:relative;width:100%;white-space:nowrap;}',
            '#slider > div > nav{position:absolute;width:100%;bottom:40px;text-align:center;}',
            '#slider > div > nav > button{display:inline-block;vertical-align:top;background:none;border:0}',
            '#slider > div > ul > li{display:inline-block;width:100%;vertical-align:top;overflow:hidden}',
            '#slider > div > ul > li.active > img {transform:scale(1,1);opacity:1}',
            '#slider > div > ul > li > img {width:100%;display:block;transition:all 500ms;transform: scale(2,2);opacity: 0;}'
        ];

        //css 추가
        $('<style>').html(stylesheet.join('\n')).appendTo('head')
        // 애니메이션
        var $slide = $('#slider');
        $slide.parent().css("height", "auto");
        var $slideWrapper = $('<div>').appendTo($slide)
        var $slideList = $('<ul>').appendTo($slideWrapper)
        var $slideNav = $('<nav>').appendTo($slideWrapper)
        var $slideLeftBtn = $("<button>").html('<svg width="50px" height="87px"><polygon fill="#FFFFFF" points="50,0 25,0 0,43.5 25,87 50,87 25,43.5 "/></svg>').appendTo($slideNav)
        var $slideRightBtn = $("<button>").html('<svg width="50px" height="87px"><polygon fill="#FFFFFF" points="50,0 25,0 0,43.5 25,87 50,87 25,43.5 "/></svg>').css({
            transform : "scaleX(-1)",
            "margin-left" : "50px"
        }).appendTo($slideNav)

        var SlideImg = ['images/slide1.png','images/slide2.png','images/slide3.png']
        $.each(SlideImg, function (i,img) {
            var $slideItem = $('<li>');
            var $slideImgItem = $("<img>").attr('src', img).appendTo($slideItem)
            $slideItem.appendTo($slideList)
        })

        var $slideItems = $slideList.find('li');
        var slideCount = $slideItems.length;
        $slideItems.clone().prependTo($slideList)
        $slideItems.clone().appendTo($slideList)
        $slideList.css({left : (-100 * slideCount)+ '%'})

        $slideItems = $slideList.find('li');

        var SLIDE_INDEX = 0;

        function moveTo(index) {
            if ($slideList.is(':animated')) {
                return
            }
            var CountSlide = ((((index + 1)% slideCount)+ slideCount -1 )% slideCount)
            $slideItems.removeClass('active');
            $slideItems.filter(function (i) {
                return CountSlide === ( i % slideCount)
            }).addClass('active')

            $slideList.animate({left : (-100* (index + slideCount))+ '%'},700, function () {
                index = CountSlide;
                SLIDE_INDEX = index;
                $slideList.css({left : (-100 * (index + slideCount))+ '%'})
            })
        }

        $slideRightBtn.on('click', function () {
          moveTo(SLIDE_INDEX + 1);
        })

        $slideLeftBtn.on('click', function () {
            moveTo(SLIDE_INDEX - 1);
        })

        moveTo(0)
        
        // 페럴렉스
        var $pa = $('.web_skill, .world_skills');
        $pa.find('img').css('transition', 'all 600ms');
        var $window = $(window).scroll(function () {
            var top = $window.scrollTop();
            for (i = $pa.length; i -- ;){
                var $section = $pa.eq(i);
                var $offset = $section.offset().top;
                var height = $section.height();
                console.log(i)
                if (top >= $offset && top <= $offset + height) {
                    $section.find('img').css('transform', 'scale(1.5,1.5)');
                }else {
                    $section.find('img').css('transform', 'scale(1,1)');
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
                "transform" : "scale(1.5,1.5)",
                "transition" : "all 600ms",
                "opacity" : ".4"
            })
        })

        $('.photo_img > img').on('mouseleave', function () {
            $(this).css({
                "transform" : "scale(1,1)",
                "transition" : "all 600ms",
                "opacity" : "1"
            })
        })

        $('.wrapper').append("<div class='dia'></div>")
        $('.photo_img > img').on('click', function () {
            var src = $(this).attr('src')
            var rep = src.replace("images/" ,"")
            $('.dia').html("<img src='images/big_" + rep + "'>")
            $('.dia > img').css('width', '100%')
            $('.dia').dialog ({
                modal :true,
                width : 640,
                height : 426,
                resizable : false,
                show: {
                    duration : 1000,
                    effect : "blind"
                },
                hide: {
                    duration : 1000,
                    effect : "blind"
                }
            })
        })

        //Results section
        $.get('../data/description.json', function (data) {
            $.each(data['WardOffice'], function (i,o) {
                var ko = o.name_ko;
                $('.contnet > .results').append("<p class='text'>" + ko +"</p>")
            })
        })
        $('.results').on('click', '.text', function () {
            var text = $(this).text()
            $.get('../data/description.json', function (data) {
                $.each(data['WardOffice'], function (i,o) {
                    var ko = o.name_ko;
                    if ( text === ko ){
                        var ko = o.name_ko
                        var en = o.name_en
                        var url = o.url
                        var map = o.map
                        var sq = o.square
                        var po = o.population
                        var de = o.description
                        var html = '';
                        html = "<p>"+ ko +"</p>"+
                            "<p>"+ en +"</p>" +
                            "<a href='" + url + "'>"+ url +"</a>" +
                            "<img src='"+ map +"'>"+
                            "<p>"+ sq +"</p>" +
                            "<p>"+ po +"</p>" +
                            "<p>"+ de +"</p>";
                        $('.dia').html(html)
                        $('.dia > img').css('width', '100%')
                        $('.dia').dialog ({
                            modal :true,
                            width : 640,
                            height : 426,
                            resizable : false,
                            show: {
                                duration : 1000,
                                effect : "blind"
                            },
                            hide: {
                                duration : 1000,
                                effect : "blind"
                            }
                        })
                    }

                })
            })
        })
    })
}