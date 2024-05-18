export async function makeRequest(url, data) {
  const request = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return request.json;
}
