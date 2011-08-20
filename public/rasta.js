(function(d,w,r,j){
  /* d, document                                                                */
  /* w, window                                                                  */
  /* r  placeholder for Rasta opbject                                           */
  /* j  placeholder for jsonp helper function                                   */
  j = function(a,b,e,c,s){
    /* a,  the url, such as 'http://test.com/foo?q=bar&callback='               */
    /* b,  the callback function                                                */
    /* e,  the error function                                                   */
    /* c,  placeholder for callback name                                        */
    /* s   placeholder for script tag                                           */
    d.body                    /* on the document body,                          */
      .appendChild(           /* attach                                         */
        s = d.createElement(  /* a created script.                              */
          c = 'script'        /* set d to 'script', used later as prefix        */
        )
      ).src = r.url + a + (   /* set src to url +                               */
        c = c + (     /* the name on the window, which is 'script' +            */
          j.i = -~j.i /* the current increment, itself + 1 or 1                 */
        )
      );

    e && (s.onerror = e);             /* attack error callback                  */

    (a=window)[c] = function(v) {   /* put the callback on window object, and   */
      b(v)                          /* call it when it's done.                  */
      delete a[c]                   /* also remove callback from window object  */
      d.body.removeChild(s)         /* and remove script tag                    */
    }
  }

  window.Rasta = r = {
    url:'http://rasta.errorjs.com',
    valid:function(k){ return k.replace(/[ ?\/]/g,'').substring(0,250) },
    get:function(k,c,e){ return j('/get/'+this.valid(k)+'?callback=',c,e) },
    set:function(k,v,c,e){ return j('/set/'+this.valid(k)+'/'+this.valid(v)+'?callback=',c,e) }
  }
})(document, window)
