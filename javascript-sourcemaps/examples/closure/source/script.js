(function($){
    $.getJSON('http://search.twitter.com/search.json?callback=?', {
        q: 'jspyconf'
    }).done(function( data ) {
        $.each( data.results, function( i, tweet ) {
            $('<img />').attr('src', tweet.profile_image_url).appendTo('body');
        });
    });
})(jQuery);