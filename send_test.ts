// Copyright 2018-2019 the oak authors. All rights reserved. MIT license.

import { test } from "https://deno.land/std@v0.3.4/testing/mod.ts";
import { assert, equal, assertStrictEq } from "https://deno.land/std@v0.3.4/testing/asserts.ts";

import { Application } from "./application.ts";
import { Context } from "./context.ts";
import { Status } from "./deps.ts";
import httpErrors from "./httpError.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { send } from "./send.ts";

let encodingsAccepted = "identity";

function createMockApp<S extends object = { [key: string]: any }>(
  state = {} as S
): Application<S> {
  return {
    state
  } as any;
}

function createMockContext<S extends object = { [key: string]: any }>(
  app: Application<S>,
  path = "/",
  method = "GET"
) {
  return {
    app,
    request: {
      acceptsEncodings() {
        return encodingsAccepted;
      },
      headers: new Headers(),
      method,
      path,
      search: undefined,
      searchParams: new URLSearchParams(),
      url: path
    } as Request,
    response: {
      status: Status.OK,
      body: undefined,
      headers: new Headers()
    } as Response,
    state: app.state
  } as Context<S>;
}

function setup<S extends object = { [key: string]: any }>(
  path = "/",
  method = "GET"
): {
  app: Application<S>;
  context: Context<S>;
} {
  encodingsAccepted = "identity";
  const app = createMockApp<S>();
  const context = createMockContext<S>(app, path, method);
  return { app, context };
}

test(async function sendHtml() {
  const { context } = setup("/test.html");
  const fixture = await Deno.readFile("./fixtures/test.html");
  await send(context, context.request.path, {
    root: "./fixtures"
  });
  equal(context.response.body, fixture);
  equal(context.response.type, ".html");
  equal(
    context.response.headers.get("content-length"),
    String(fixture.length)
  );
  assert(context.response.headers.get("last-modified") != null);
  equal(context.response.headers.get("cache-control"), "max-age=0");
});

test(async function sendGzip() {
  const { context } = setup("/test.json");
  const fixture = await Deno.readFile("./fixtures/test.json.gz");
  encodingsAccepted = "gzip";
  await send(context, context.request.path, {
    root: "./fixtures"
  });
  equal(context.response.body, fixture);
  equal(context.response.type, ".json");
  equal(context.response.headers.get("content-encoding"), "gzip");
  equal(
    context.response.headers.get("content-length"),
    String(fixture.length)
  );
});

test(async function sendBrotli() {
  const { context } = setup("/test.json");
  const fixture = await Deno.readFile("./fixtures/test.json.br");
  encodingsAccepted = "br";
  await send(context, context.request.path, {
    root: "./fixtures"
  });
  equal(context.response.body, fixture);
  equal(context.response.type, ".json");
  equal(context.response.headers.get("content-encoding"), "br");
  equal(
    context.response.headers.get("content-length"),
    String(fixture.length)
  );
});

test(async function sendIdentity() {
  const { context } = setup("/test.json");
  const fixture = await Deno.readFile("./fixtures/test.json");
  await send(context, context.request.path, {
    root: "./fixtures"
  });
  equal(context.response.body, fixture);
  equal(context.response.type, ".json");
  assertStrictEq(context.response.headers.get("content-encoding"), null);
  equal(
    context.response.headers.get("content-length"),
    String(fixture.length)
  );
});

test(async function send404() {
  const { context } = setup("/foo.txt");
  encodingsAccepted = "identity";
  let didThrow = false;
  try {
    await send(context, context.request.path, {
      root: "./fixtures"
    });
  } catch (e) {
    assert(e instanceof httpErrors.NotFound);
    didThrow = true;
  }
  assert(didThrow);
});
