interface Response<D> {
  ok: boolean;
  status: number;
  data: D;
}

interface Options {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  returnType: 'text' | 'json';
  url: string;
  query?: string;
  body?: string;
}

interface Headers {
  'Content-Type': 'application/json' | 'text/plain';
}

abstract class RequestBuilder {
  protected options: Options;

  protected headers: Headers = { 'Content-Type': 'text/plain' };

  constructor(url: string) {
    this.options = {
      method: 'GET',
      returnType: 'text',
      url,
    };
  }

  public get() {
    this.options.method = 'GET';
    return this;
  }

  public post() {
    this.options.method = 'POST';
    return this;
  }

  public put() {
    this.options.method = 'PUT';
    return this;
  }

  public patch() {
    this.options.method = 'PATCH';
    return this;
  }

  public delete() {
    this.options.method = 'DELETE';
    return this;
  }

  public header(key: keyof Headers, value: Headers[typeof key]) {
    this.headers[key] = value;
    return this;
  }

  public query<T extends Record<string | number | symbol, string | number | boolean | string[]>>(params: T) {
    if (Object.keys(params).length === 0) return this;

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        value.forEach((subValue) => searchParams.append(key, subValue));
      } else {
        searchParams.append(key, value.toString());
      }
    }

    const query = searchParams.toString();

    if (query.trim().length) {
      this.options.query = query;
    }

    return this;
  }

  public contentType(contentType: Headers['Content-Type']) {
    this.header('Content-Type', contentType);
    return this;
  }

  public body<B extends Options['body']>(body: B) {
    this.options.body = body;
    return this;
  }

  public jsonBody<B>(body: B) {
    this.contentType('application/json');
    this.body(JSON.stringify(body));
    return this;
  }

  public returnType(returnType: Options['returnType']) {
    this.options.returnType = returnType;
    return this;
  }

  public abstract request<T>(): Promise<Response<T>>;
}

class FetchRequestBuilder extends RequestBuilder {
  public async request<T>() {
    const { url, query, method, body, returnType } = this.options;
    const fetchOptions: RequestInit = {
      method,
      body,
      headers: this.headers as unknown as Record<string, string>,
    };

    const fullUrl = query ? `${url}?${query}` : url;

    const res = await fetch(fullUrl, fetchOptions);
    const data = (await res[returnType]()) as T;

    return { data, ok: res.ok, status: res.status };
  }
}

export const HttpRequest = FetchRequestBuilder;
