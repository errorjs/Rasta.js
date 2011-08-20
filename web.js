var connect = require('connect'),
    jsonp = require('connect-jsonp'),
    port = process.env.PORT || 5000,
    redis_url = process.env.REDISTOGO_URL || 'redis://localhost:6379',
    redis = require("redis-url").createClient(redis_url)

var valid = function(k){
  return k.replace(/[ ?\/]/g,'').substring(0,250)
}

connect.createServer(
  connect.logger({ format: ':method :url' }),
  connect.responseTime(),
  connect.static(__dirname + '/public'),
  jsonp(),
  connect.errorHandler({ dumpExceptions: true, showStack: true }),
  connect.router(function(app){
    app.get('/rasta.min.js', function(req, res, next){
      res.writeHead(200, {'Content-Type': 'text/javascript'})
      res.end("(function(d,w,r,j){j=function(a,b,e,c,s){d.body.appendChild(s=d.createElement(c='script')).src=r.url+a+(c=c+(j.i=-~j.i));e&&(s.onerror=e);(a=window)[c]=function(v){b(v);delete a[c];d.body.removeChild(s)}};window.Rasta=r={url:'http://rasta.errorjs.com',valid:function(k){return k.replace(/[ ?\/]/g,'').substring(0,250)},get:function(k,c,e){return j('/get/'+this.valid(k)+'?callback=',c,e)},set:function(k,v,c,e){return j('/set/'+this.valid(k)+'/'+this.valid(v)+'?callback=',c,e)}}})(document,window)")
    })
    app.get('/get/:key', function(req, res, next){
      var key = valid(req.params.key)
      redis.get(key, function(err, val){
        if(err){
          console.log('err:'+err)
          connect.utils.badRequest(res)
        } else {
          res.writeHead(200, {'Content-Type': 'text/json'});
          res.end(JSON.stringify(val || ''))
        }
      })
    })
    app.get('/set/:key/:val', function(req, res, next){
      var key = valid(req.params.key),
          val = valid(req.params.val)
      redis.set(key, val, function(err){
        if(err){
          console.log(err)
          connect.utils.badRequest(res)
        } else {
          res.writeHead(200, {'Content-Type': 'text/text'})
          res.end()
        }
      })
    })
  })
).listen(port)
