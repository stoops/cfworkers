/* worker */
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  /* request */
  var newReqs = new URL(request.url);
  newReqs.hostname = "fossjon.wordpress.com";
  var repHost = new RegExp(newReqs.hostname, "mig");
  var reqHost = request.headers.get("host");
  const response = await fetch(newReqs, request);

  /* response */
  const newHead = new Response(response.body, response);
  for (var keyVal of newHead.headers.entries()) {
    if (keyVal[0].toLowerCase().includes("location")) {
      var newHost = keyVal[1].replace(repHost, reqHost);
      newHead.headers.set(keyVal[0], newHost);
    }
  }
  if (newReqs.pathname.match(/^.*\.[0-9A-Za-z]{3,5}$/mig)) {
    var newBody = await response.blob();
  } else {
    var newBody = await response.text();
    newBody = newBody.replace(repHost, reqHost);
  }

  /* return */
  return new Response(newBody, newHead);
}
