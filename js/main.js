function lightboxOnResize(){
    if ($(window).width() <= 768) {
        $('[data-lightbox]').each(function(){
            console.log($(this));
            var currentData = $(this).attr("data-lightbox");
            if (currentData){
                $('a[data-lightbox]').attr("data-lightbox-off", currentData).removeAttr("data-lightbox");
            }
        });
    } else {
        $('[data-lightbox]').each(function(){
            var currentData = $(this).attr("data-lightbox-off");
            if (currentData){
                $('a[data-lightbox]').attr("data-lightbox", currentData).removeAttr("data-lightbox-off");
            }
        });
    }
}
$(window).on('resize', function(){
    lightboxOnResize();
});

$(document).ready(function(){
    /* twitter */
    $('#Twitter .tweets').tweet({
        count: 3, //how many tweets?
        template: "{text} {time}",
        li_class: "span4 tweet",
        twitter_api_url: 'twitter/proxy/twitter_proxy.php'
    });
});

/* helper : scroll function */

function scrollToAnchor(aid){
    $('html,body').animate({scrollTop: aid.offset().top-74}, 600, 'swing');
}

$(window).load(function(){
    lightboxOnResize();

    /* parallax */

    //.parallax(xPosition, speedFactor, outerHeight) options:
    //xPosition - Horizontal position of the element
    //inertia - speed to move relative to vertical scroll. Example: 0.1 is one tenth the speed of scrolling, 2 is twice the speed of scrolling
    //outerHeight (true/false) - Whether or not jQuery should use it's outerHeight option to determine when a section is in the viewport
    $('#MainHeader').parallax("20%", 0.2);
    $('#Work').parallax("20%", 0.2);
    $('#Info').parallax("20%", 0.2);
    $('#Contact').parallax("20%", 0.2);


    /* flexslider */
    $('#Work .flexslider').flexslider({
        slideshow: false
    });
    $('#Work .flexslider .slides li:first-child').addClass("flex-active-slide").css({"display": "list-item"});


	/* main navigation scrolling */

    var a={selector:"#MainNav.sticky","class":"stick",offset:0};
    var b=$(a.selector);
    a.offset=b.offset().top;
    var c=$(window).scrollTop();
    c>=a.offset?(b.addClass(a["class"])):b.removeClass(a["class"]);
    $(window).scroll(function(){
        var c=$(window).scrollTop();
        c>=a.offset?(b.addClass(a["class"])):b.removeClass(a["class"]);
    });


    $('#MainNav a[href^="#"]').on('click',function (e) {
        if(!$('#MainNav button').hasClass("collapsed")) {
            $('#MainNav button').click();
        }

        e.preventDefault();
        var target = this.hash,
            $target = $(target);
        if (target == "#MainNav") {
            var offset = $target.offset().top;
        } else {
            if ($(document).width() <= 980) {
                var offset = $target.offset().top;
            } else {
                var offset = $target.offset().top - 72;
            }
        }
        $('html, body').stop().animate({
            'scrollTop': offset
        }, 600, 'swing', function () {
            /*window.location.hash = target;*/
        });
    });

	/* works ajax portfolio */

    /* numbers thumbnails in work list (#Work .slides) from 1 to x */
    var workThumbnails = $("#Work .preview ul.slides li a");

    workThumbnails.each(function(index, thumbnail) {
        var i = index + 1;
        $(thumbnail).data("index", i);
    });

    /* show/hide animation */
    function showFullView (){
        $("#Work").removeClass("general").addClass("details");
    }
    function hideFullView () {
        $("#Work").removeClass("details").addClass("general");
    }
    hideFullView();

    function findSiblings (index, list) {
        var pindex = index-1;
        var ptarget = "";
        if (pindex <= 0) {
            pindex = list.length;
            ptarget = list.last().attr("href");
        } else {
            ptarget = list.filter(function(){
                return ($(this).data("index") == pindex)
            });
            ptarget = ptarget.attr("href");
        }
        var nindex = index+1;
        var ntarget = "";
        if (nindex > workThumbnails.length) {
            nindex = 1;
            ntarget = list.first().attr("href");
        } else {
            ntarget = list.filter(function(){
                return ($(this).data("index") == nindex)
            });
            ntarget = ntarget.attr("href");
        }
        siblings = new Object();
        siblings.p = new Object();
        siblings.p.index = pindex;
        siblings.p.target = ptarget;
        siblings.n = new Object();
        siblings.n.index = nindex;
        siblings.n.target = ntarget;
        return siblings;
    }

    var container = $("#Work > .container");
    var box = $("section.full-view", container);
    /* Load content with Ajax when thumbnail is clicked */
    $("#Work .preview .slides a").on('click',function (e) {
        e.preventDefault();
        var $work = $("#Work");
        targets = new Object();
        targets.c = new Object();
        targets.c.target = $(this).attr('href');
        targets.c.index = $(this).data('index');
        targets.s = findSiblings(targets.c.index, workThumbnails);

        if (targets.c.target != "#" && targets.c.target != "") {
            $("#Work .full-view").load(targets.c.target, function(){
                $("#Work").data('target', targets.c.target);
                $("#Work").data('index', targets.c.index);

                /*$(this).parent().height($(this).outerHeight(true));*/
                showFullView();

                /* create sibling box elements. pre-load next/prev works there. needed in next/prev animation */
                $(function () {
                    box.clone().removeClass().addClass("full-view row-fluid left clone").appendTo(container).load(targets.s.p.target);
                    box.clone().removeClass().addClass("full-view row-fluid right clone").appendTo(container).load(targets.s.n.target);
                    box.addClass("original");
                });
                lightboxOnResize();
            });
        }
	    scrollToAnchor($work);
    });

    /* ------------------------------------------ */
    /* ------------------------------------------ */
    /* ------------------------------------------ */

    function slide (dir){
        var $work = $("#Work");
        $(".full-view", $work).removeClass("invisible");
        var rclone = $(".clone.right", $work);
        var lclone = $(".clone.left", $work);
        var original = $(".original", $work);
        var targetH = original.height();
        if (dir == "l") {

            $work.data('target', siblings.n.target).data('index', findSiblings($work.data("index"), workThumbnails).n.index);
            siblings = new Object();
            siblings = findSiblings($work.data("index"), workThumbnails);
            siblings.c = new Object();
            siblings.c.target = $work.data("target");
            siblings.c.index = $work.data("index");

            var targetH = rclone.height();
            rclone.toggleClass("clone right original");
            original.toggleClass("clone original left");
            lclone.toggleClass("left right invisible");
            rclone = $(".clone.right", $work);
            rclone.load(siblings.n.target, function(){
                lightboxOnResize();
            });
        } else if (dir == "r") {

            $work.data('target', siblings.p.target).data('index', findSiblings($work.data("index"), workThumbnails).p.index);
            siblings = new Object();
            siblings = findSiblings($work.data("index"), workThumbnails);
            siblings.c = new Object();
            siblings.c.target = $work.data("target");
            siblings.c.index = $work.data("index");

            var targetH = lclone.height();
            lclone.toggleClass("clone left original");
            original.toggleClass("clone original right");
            rclone.toggleClass("right left invisible");
            lclone = $(".clone.left", $work);
            lclone.load(siblings.p.target, function(){
                lightboxOnResize();
            });
        }
    }
    $(document).on('click', "#Work .full-view nav a.all", function() {
        hideFullView();
        $("#Work .clone").remove();

	    return false;
    });
    $(document).on('click', "#Work .full-view nav a.prev", function(){
        slide("r");

	    return false;
    });
    $(document).on('click', "#Work .full-view nav a.next", function(){
        slide("l");

	    return false;
    });


	/* mail validation */

	$("input[type='email']").on({
     blur : function(){
         if ($(this).val()){
             $(this).addClass("filled")
         } else {
             $(this).removeClass("filled")
         }
     }
 });
});