// Copyright 2018-2019 the oak authors. All rights reserved. MIT license.

import { test } from "https://deno.land/std@v0.3.4/testing/mod.ts";
import { equal } from "https://deno.land/std@v0.3.4/testing/asserts.ts";
import { Response } from "./response.ts";

const decoder = new TextDecoder();

test(function emptyResponse() {
  const response = new Response();
  const serverResponse = response.toServerResponse();
  equal(serverResponse.body, undefined);
  equal(serverResponse.status, 404);
  equal(Array.from(serverResponse.headers!.entries()).length, 1);
  equal(serverResponse.headers!.get("Content-Length"), "0");
});

test(function statusSet() {
  const response = new Response();
  response.status = 302;
  const serverResponse = response.toServerResponse();
  equal(serverResponse.body, undefined);
  equal(serverResponse.status, 302);
  equal(Array.from(serverResponse.headers!.entries()).length, 1);
  equal(serverResponse.headers!.get("Content-Length"), "0");
});

test(function bodyText() {
  const response = new Response();
  response.body = "Hello world!";
  const serverResponse = response.toServerResponse();
  equal(decoder.decode(serverResponse.body), "Hello world!");
  equal(serverResponse.status, 200);
  equal(
    serverResponse.headers!.get("content-type"),
    "text/plain; charset=utf-8"
  );
  equal(Array.from(serverResponse.headers!.entries()).length, 1);
});

test(function bodyHtml() {
  const response = new Response();
  response.body = "<!DOCTYPE html><html><body>Hello world!</body></html>";
  const serverResponse = response.toServerResponse();
  equal(
    decoder.decode(serverResponse.body),
    "<!DOCTYPE html><html><body>Hello world!</body></html>"
  );
  equal(serverResponse.status, 200);
  equal(
    serverResponse.headers!.get("content-type"),
    "text/html; charset=utf-8"
  );
  equal(Array.from(serverResponse.headers!.entries()).length, 1);
});

test(function bodyJson() {
  const response = new Response();
  response.body = { foo: "bar" };
  const serverResponse = response.toServerResponse();
  equal(decoder.decode(serverResponse.body), `{"foo":"bar"}`);
  equal(serverResponse.status, 200);
  equal(
    serverResponse.headers!.get("content-type"),
    "application/json; charset=utf-8"
  );
  equal(Array.from(serverResponse.headers!.entries()).length, 1);
});

test(function bodySymbol() {
  const response = new Response();
  response.body = Symbol("foo");
  const serverResponse = response.toServerResponse();
  equal(decoder.decode(serverResponse.body), "Symbol(foo)");
  equal(serverResponse.status, 200);
  equal(
    serverResponse.headers!.get("content-type"),
    "text/plain; charset=utf-8"
  );
  equal(Array.from(serverResponse.headers!.entries()).length, 1);
});

test(function bodyUint8Array() {
  const response = new Response();
  response.body = new TextEncoder().encode("Hello world!");
  const serverResponse = response.toServerResponse();
  equal(decoder.decode(serverResponse.body), "Hello world!");
  equal(serverResponse.status, 200);
  equal(Array.from(serverResponse.headers!.entries()).length, 0);
});

test(function typeDoesNotOverwrite() {
  const response = new Response();
  response.type = "js";
  response.body = "console.log('hello world');";
  const serverResponse = response.toServerResponse();
  equal(
    decoder.decode(serverResponse.body),
    "console.log('hello world');"
  );
  equal(serverResponse.status, 200);
  equal(
    serverResponse.headers!.get("content-type"),
    "application/javascript; charset=utf-8"
  );
  equal(Array.from(serverResponse.headers!.entries()).length, 1);
});

test(function contentTypeDoesNotOverwrite() {
  const response = new Response();
  response.type = "js";
  response.body = "console.log('hello world');";
  response.headers.set("content-type", "text/plain");
  const serverResponse = response.toServerResponse();
  equal(
    decoder.decode(serverResponse.body),
    "console.log('hello world');"
  );
  equal(serverResponse.status, 200);
  equal(serverResponse.headers!.get("Content-Type"), "text/plain");
  equal(Array.from(serverResponse.headers!.entries()).length, 1);
});

test(function contentLengthSetsTo0() {
  const response = new Response();
  const serverResponse = response.toServerResponse();
  equal(serverResponse.headers!.get("Content-Length"), "0");
});
