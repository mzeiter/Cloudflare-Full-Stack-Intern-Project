addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with randomly chosen URL from API, with modified HTML
 * @param {Request} request
 */
async function handleRequest(request) {

  // fetch the json variants from the api
  const API = 'https://cfw-takehome.developers.workers.dev/api/variants'
  response = await fetch(API);
  json_response = await response.json();
  vars_arr = json_response['variants'];

  // randomly choose one of the two URL's
  rand_url = Math.random() < 0.5 ? 0 : 1;
  response = await fetch(vars_arr[rand_url]);


  // using HTMLRewriter to modify content of some HTML elements
  const MODIFIED_HTML = new HTMLRewriter()
  	.on('title', new ElementHandler("Cloudflare Full-stack Internship Project"))
  	.on('h1#title', new ElementHandler("Mitchell Zeiter's Cloudflare Project"))
    .on('p#description', new ElementHandler(`Hello! Welcome to Page #${rand_url + 1}`))
  	.on('a#url', new ElementHandler("Connect with me on LinkedIn!"))
    .on('a#url', new ElementHandler('https://www.linkedin.com/in/mitchell-zeiter/', 'href'))
  


  	// Persisting variants (cookies)
  	const NAME = ''
  	const COOKIE = request.headers.get('cookie')

  	// check if cookie exists for first URL
  	if (COOKIE && COOKIE.includes(`${NAME}=URL1`)) {
  	  return MODIFIED_HTML.transform(await fetch(vars_arr[0], request))
  	}
  	// check if cookie exists for second URL
  	else if (COOKIE && COOKIE.includes(`${NAME}=URL2`)) {
  	  return MODIFIED_HTML.transform(await fetch(vars_arr[1], request))
  	}
  	// no cookies exits, so we now set one for this page
  	else{
  	  response = new Response(response.body, response)
      response.headers.append('Set-Cookie', `${NAME}=URL${rand_url + 1}; path=/`)
      return MODIFIED_HTML.transform(response)
  	}
}


/* ElementHandler class used to change text and attributes of HTML  */
class ElementHandler {

  constructor(newContent, attribute) {
    this.newContent = newContent
    this.attribute = attribute
  }

  // setting the new content for the given HTML element
  element(element) {
    if (!this.attribute) {
      element.setInnerContent(this.newContent);
    } else { 
      element.setAttribute(this.attribute, this.newContent);
    }
  }
}

