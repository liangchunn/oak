// Copyright 2018-2019 the oak authors. All rights reserved. MIT license.

import { test } from "https://deno.land/std@v0.3.4/testing/mod.ts";
import { equal, assert } from "https://deno.land/std@v0.3.4/testing/asserts.ts";
import { Context } from "./context.ts";
import * as mod from "./mod.ts";

test(function publicApi() {
  assert(mod != null);
  equal(typeof mod.Application, "function");
  equal(typeof mod.Context, "function");
  equal(typeof mod.HttpError, "function");
  equal(typeof mod.composeMiddleware, "function");
  equal(typeof mod.BodyType, "object");
  equal(typeof mod.Request, "function");
  equal(typeof mod.Response, "function");
  equal(typeof mod.Router, "function");
  equal(typeof mod.STATUS_TEXT, "object");
  equal(typeof mod.Status, "object");
  equal(typeof mod.send, "function");
  equal(Object.keys(mod).length, 11);
});
