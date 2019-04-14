// Copyright 2018-2019 the oak authors. All rights reserved. MIT license.

import { test } from "https://deno.land/std@v0.3.4/testing/mod.ts";
import { equal, assertStrictEq, assertThrowsAsync } from "https://deno.land/std@v0.3.4/testing/asserts.ts";
import { ServerRequest } from "./deps.ts";
import httpErrors from "./httpError.ts";
import { Request, BodyType } from "./request.ts";

const encoder = new TextEncoder();

function createMockServerRequest(
  url = "/",
  body = "",
  headerValues: { [header: string]: string } = {}
): ServerRequest {
  const headers = new Headers();
  for (const [key, value] of Object.entries(headerValues)) {
    headers.set(key, value);
  }
  if (body.length && !headers.has("content-length")) {
    headers.set("content-length", String(body.length));
  }
  return {
    headers,
    method: "GET",
    url,
    body() {
      return Promise.resolve(encoder.encode(body));
    },
    async respond() {}
  } as any;
}

test(function requestSearch() {
  const request = new Request(createMockServerRequest("/foo?bar=baz&qat=qux"));
  equal(request.path, "/foo");
  equal(request.search, "?bar=baz&qat=qux");
  equal(request.method, "GET");
  equal(Array.from(request.searchParams.entries()), [
    ["bar", "baz"],
    ["qat", "qux"]
  ]);
});

test(function serverRequestAvail() {
  const mockServerRequest = createMockServerRequest();
  const request = new Request(mockServerRequest);
  assertStrictEq(request.serverRequest, mockServerRequest);
});

test(function requestAcceptEncoding() {
  const request = new Request(
    createMockServerRequest("/", "", {
      "Accept-Encoding": "gzip, compress;q=0.2, identity;q=0.5"
    })
  );
  equal(request.acceptsEncodings("gzip", "identity"), "gzip");
});

test(function requestAccepts() {
  const request = new Request(
    createMockServerRequest("/", "", {
      Accept: "application/json;q=0.2, text/html"
    })
  );
  equal(request.accepts("application/json", "text/html"), "text/html");
});

test(function requestAcceptsNoProvided() {
  const request = new Request(
    createMockServerRequest("/", "", {
      Accept: "application/json;q=0.2, text/html"
    })
  );
  equal(request.accepts(), ["text/html", "application/json"]);
});

test(function requestNoAccepts() {
  const request = new Request(createMockServerRequest("/"));
  equal(request.accepts("application/json"), undefined);
});

test(function requestNoAcceptsMatch() {
  const request = new Request(
    createMockServerRequest("/", "", { Accept: "text/html" })
  );
  equal(request.accepts("application/json"), undefined);
});

test(async function requestBodyJson() {
  const request = new Request(
    createMockServerRequest("/", `{"foo":"bar"}`, {
      "Content-Type": "application/json"
    })
  );
  equal(await request.body(), {
    type: BodyType.JSON,
    value: { foo: "bar" }
  });
});

test(async function requestBodyForm() {
  const request = new Request(
    createMockServerRequest("/", `foo=bar&bar=1`, {
      "Content-Type": "application/x-www-form-urlencoded"
    })
  );
  const actual = await request.body();
  equal(actual!.type, BodyType.Form);
  if (actual && actual.type === "form") {
    equal(Array.from(actual.value.entries()), [
      ["foo", "bar"],
      ["bar", "1"]
    ]);
  } else {
    throw Error("Unexpected response");
  }
});

test(async function requestBodyText() {
  const request = new Request(
    createMockServerRequest("/", "hello world!", {
      "Content-Type": "text/plain"
    })
  );
  equal(await request.body(), {
    type: BodyType.Text,
    value: "hello world!"
  });
});

test(async function noBodyResolvesUndefined() {
  const request = new Request(createMockServerRequest());
  equal(await request.body(), {
    type: BodyType.Undefined,
    value: undefined
  });
});

test(async function unsupportedMediaTypeBody() {
  const request = new Request(
    createMockServerRequest("/", "blah", {
      "Content-Type": "multipart/form-data"
    })
  );
  await assertThrowsAsync(async () => {
    await request.body();
  }, httpErrors.UnsupportedMediaType);
});
