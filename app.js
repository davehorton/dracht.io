
o = $;


//populate dropdown of sip messages
o(function(){
  var html = '<option>Choose SIP Header</option>' ;
  o('#sip-header-definitions-list .hdr').each( function(index){
    html += '<option val="' + o(this).attr('data-display-name') + '">' + o(this).attr('data-display-name') +'</option>' ;
  }) ;
  o('select#sip-header-definitions-select').html( html ) ;

  function prettyPrintHeader( hdr ) {
    var s = hdr.trim() ;

    //indent 3 spaces after level 
    var offset = 0 ;
    var s2 = '' ;
    for( var i = 0; i < s.length; i++ ) {
      var ch = '' ;
      if( ':' === s[i] ) ch = ' ' ;
      else if( '\n' === s[i] ) {
        var spaces = offset*3 ; while( spaces-- ) ch += ' ' ;
      }
      else if( '{' === s[i] ) offset++ ;
      else if( '}' === s[i] ) {
        s2 = s2.substr(0, s2.length - 3) ;
        offset-- ;
      }
      s2 += s[i] + ch ;
    }

    return s2.replace(/^\s*\n/gm,'') ;
  }

  //show header when selected
  o('#sip-header-definitions-select').on('change', function(e){
    var display = o(e.target).val() ;
    var content = o('#sip-header-definitions-list .hdr[data-display-name="' + display + '"]') ;
    if( content.length ) {

      //include components referenced as ::url:: example
      var html = content.html() ;
      do {
        var re =  /::(\w+)::/g ;
        var found = false ;
        html = html.replace(re, function replacer(match, p1, offset, string) {
          var replaceText = o('#sip-header-definitions-list .hdr-component.' + p1).html() ;
          found = true ;
          return replaceText ;
        });
        if( !found ) break ;
      } while( true ) ;

      html = prettyPrintHeader( html ) ;

      var note = content.attr('data-display-note') || 'Structure:' ;

      o('#sip-header-definitions-display').show() ;
      o('#sip-header-definitions-display code').html( html ); 
      o('#sip-header-definitions-note span').html( note ); 
    }
    else {
      o('#sip-header-definitions-display').hide() ;
      o('#sip-header-definitions-display code').html(''); 
      o('#sip-header-definitions-note span').html(''); 

    }
  }) ;
})

// misc junk

o(function(){
  var width = window.innerWidth;
  var height = window.innerHeight;
  var doc = o(document);

  // .onload
  o('html').addClass('onload');

  // top link
  o('#top').click(function(e){
    o('body').animate({ scrollTop: 0 }, 'fast');
    e.preventDefault();
  });

  // scrolling links
  var added;
  doc.scroll(function(e){
    if (doc.scrollTop() > 5) {
      if (added) return;
      added = true;
      o('body').addClass('scroll');
    } else {
      o('body').removeClass('scroll');
      added = false;
    }
  })

  // highlight code
  o('pre.js code').each(function(){
    o(this).html(highlight(o(this).text()));
  })
})

// active menu junk

o(function(){
  var prev;
  var n = 0;

  var headings = o('h3').map(function(i, el){
    return {
      top: o(el).offset().top,
      id: el.id
    }
  });

  function closest() {
    var h;
    var top = o(window).scrollTop();
    var i = headings.length;
    while (i--) {
      h = headings[i];
      if (top >= h.top) return h;
    }
  }

  o(document).scroll(function(){
    var h = closest();
    if (!h) return;

    if (prev) {
      prev.removeClass('active');
      prev.parent().parent().removeClass('active');
    }

    var a = o('a[href="#' + h.id + '"]');
    a.addClass('active');
    a.parent().parent().addClass('active');

    prev = a;
  })
})

/**
 * Highlight the given `js`.
 */

function highlight(js) {
  return js
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
    .replace(/('.*?')/gm, '<span class="string">$1</span>')
    .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
    .replace(/(\d+)/gm, '<span class="number">$1</span>')
    .replace(/\bnew *(\w+)/gm, '<span class="keyword">new</span> <span class="init">$1</span>')
    .replace(/\b(function|new|throw|return|var|if|else)\b/gm, '<span class="keyword">$1</span>')
}