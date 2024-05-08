/*
The issue was that the browser is sending a preflight OPTIONS request before the actual POST request, and your server is not handling the OPTIONS request correctly.
When you have a POST request with a content type other than application/x-www-form-urlencoded, multipart/form-data, or text/plain, the browser sends a preflight OPTIONS request to check if the server allows the actual request. In your case, the content type is application/json, so the preflight request is triggered.
To fix this, you need to handle the OPTIONS request in your Deno backend and return the appropriate CORS headers. Here's the modified backend code:
*/
const sharedHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('', {
      headers: sharedHeaders,
    });
  }

  const contentType = request.headers.get('content-type');
  console.log(contentType);

  const json = await request.json();
  console.log(json);
  return new Response(JSON.stringify({ hello: json.name }), {
    headers: { ...sharedHeaders, 'content-type': 'application/json' },
  });
});
