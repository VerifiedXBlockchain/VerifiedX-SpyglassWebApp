interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

export async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request);

  try {
    response.parsedBody = await response.json();
  } catch (ex) { }

  // if (!response.ok) {
  //   throw new Error(response.statusText);
  // }
  return response;
}

export async function httpGet<T>(
  path: string,
  params: any,

  args: RequestInit = {
    method: "get",
    cache: "no-cache",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }
): Promise<HttpResponse<T>> {
  const url = path + "?" + new URLSearchParams(params);

  return await http<T>(new Request(url, args));
}

export async function httpPost<T>(
  path: string,
  body: any,

  args: RequestInit = {
    method: "post",
    body: JSON.stringify(body),
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}
