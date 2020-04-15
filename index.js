addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  // fetch the json variants from the api
  response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  json_response = await response.json();
  vars = json_response['variants'];

  // randomly choose one of the two URL's
  rand_url = Math.random() < 0.5 ? 0 : 1;
  response = await fetch(vars[rand_url]);
  

  return new Response('Hello worker!', {
    headers: { 'Content-type': 'text/html' },
  })
}