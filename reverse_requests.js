/* worker */
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  /* request */
  var newReqs = new URL(request.url);
  newReqs.hostname = "fossjon.wordpress.com";
  //newReqs.pathname = newReqs.pathname.replace(/\/*$/mig, "") + "/";
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
  const resText = await response.text();
  const newBody = resText.replace(repHost, reqHost);

  /* return */
  return new Response(newBody, newHead);
}
