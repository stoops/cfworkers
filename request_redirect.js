addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

async function handleRequest(request) {
  /* parse */
  var reqsplit = request.url.split("/");
  var pagelist = ["hot", "new", "top"];
  var pagename = reqsplit.pop().split(".").shift();
  var subsname = reqsplit.pop();
  var pagenumb = pagelist.indexOf(pagename);
  if (pagenumb < 0) { pagenumb = parseInt(Math.random() * pagelist.length); }
  if (!subsname || !subsname.match(/^[A-Za-z]+$/)) { subsname = "MechanicalKeyboards"; }
  subsname = "MechanicalKeyboards";
  /* request */
  var redirect = new URL(request.url);
  redirect.hostname = "rss.reddit.com";
  redirect.pathname = ("/r/" + subsname + "/" + pagelist[pagenumb] + "/");
  let response = await fetch(redirect, request);
  /* response */
  var stat = 302;
  var durl = "https://abc.com/r/xyz/img.jpg";
  let work = await response.text().then(function (text) {
    var subs = text.replace(/[&;]/mig, " ").split(" ");
    var urls = [];
    for (var i = 0; i < subs.length; ++i) {
      var data = subs[i].match(/^https:..(i.redd.it|i.imgur.com).*$/i);
      if (data) {
        urls.push(subs[i]);
      }
    }
    if (urls.length > 0) {
      var rand = parseInt(Math.random() * urls.length);
      durl = urls[rand];
    }
  });
  /* redirect */
  return Response.redirect(durl, stat);
}
