// Copyright 2018-2019 the oak authors. All rights reserved. MIT license.
import { test } from "https://deno.land/std@v0.3.4/testing/mod.ts";
import { equal, assert } from "https://deno.land/std@v0.3.4/testing/asserts.ts";
import httpError, { createHttpError } from "./httpError.ts";

test(function createHttpErrorTest() {
  const err = createHttpError(501);
  assert(err instanceof httpError.NotImplemented);
  equal(err.status, 501);
  equal(err.name, "NotImplementedError");
  equal(err.message, "Not Implemented");
});

test(function notImplemented() {
  const err = new httpError.NotImplemented();
  equal(err.status, 501);
  equal(err.name, "NotImplementedError");
  equal(err.message, "Not Implemented");
});
