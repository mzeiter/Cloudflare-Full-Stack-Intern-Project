addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with randomly chosen URL from API, with modified HTML
 * @param {Request} request
 */
async function handleRequest(request) {

  // fetch the json variants from the api
  response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  json_response = await response.json();
  vars_arr = json_response['variants'];

  // randomly choose one of the two URL's
  rand_url = Math.random() < 0.5 ? 0 : 1;
  response = await fetch(vars_arr[rand_url]);


  // using HTMLRewriter to modify content of some HTML elements */
  const modified_html = new HTMLRewriter()
  	.on('title', new ElementHandler("Cloudflare Full-stack Internship Project"))
  	.on('h1#title', new ElementHandler("Mitchell Zeiter's Cloudflare Project"))
  	.on('p#description', new ElementHandler("Hello! This is my Cloudflare full-stack internship project."))
  	.on('a#url', new ElementHandler("Connect with me on LinkedIn!"))
    .on('a#url', new ElementHandler('https://www.linkedin.com/in/mitchell-zeiter/', 'href'))
  	.transform(response)

  
  	const modified_html_text = await modified_html.text()

  return new Response(modified_html_text, {
    headers: { 'Content-type': 'text/html' },
  })
}


/* ElementHandler class used to change text and attributes of HTML  */
class ElementHandler {

  constructor(newContent, attribute) {
    this.newContent = newContent
    this.attribute = attribute
  }

  element(element) {
    if (!this.attribute) {
      element.setInnerContent(this.newContent);
    } else { 
      element.setAttribute(this.attribute, this.newContent);
    }
  }
}

