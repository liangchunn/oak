// Copyright 2018-2019 the oak authors. All rights reserved. MIT license.

import { test } from "https://deno.land/std@v0.3.4/testing/mod.ts";
import { equal, assertStrictEq } from "https://deno.land/std@v0.3.4/testing/asserts.ts";
import { isMediaType } from "./isMediaType.ts";

test(function shouldIgnoreParams() {
  const actual = isMediaType("text/html; charset=utf-8", ["text/*"]);
  equal(actual, "text/html");
});

test(function shouldIgnoreParamsLWS() {
  const actual = isMediaType("text/html ; charset=utf-8", ["text/*"]);
  equal(actual, "text/html");
});

test(function shouldIgnoreCasing() {
  const actual = isMediaType("text/HTML", ["text/*"]);
  equal(actual, "text/html");
});

test(function shouldFailWithInvalidType() {
  const actual = isMediaType("text/html**", ["text/*"]);
  equal(actual, false);
});

test(function returnsFalseWithInvalidTypes() {
  equal(isMediaType("text/html", ["text/html/"]), false);
});

test(function noTypesGiven() {
  equal(isMediaType("image/png", []), "image/png");
});

test(function typeOrFalse() {
  equal(isMediaType("image/png", ["png"]), "png");
  equal(isMediaType("image/png", [".png"]), ".png");
  equal(isMediaType("image/png", ["image/png"]), "image/png");
  equal(isMediaType("image/png", ["image/*"]), "image/png");
  equal(isMediaType("image/png", ["*/png"]), "image/png");

  equal(isMediaType("image/png", ["jpeg"]), false);
  equal(isMediaType("image/png", [".jpeg"]), false);
  equal(isMediaType("image/png", ["image/jpeg"]), false);
  equal(isMediaType("image/png", ["text/*"]), false);
  equal(isMediaType("image/png", ["*/jpeg"]), false);

  equal(isMediaType("image/png", ["bogus"]), false);
  equal(isMediaType("image/png", ["something/bogus*"]), false);
});

test(function firstTypeOrFalse() {
  equal(isMediaType("image/png", ["png"]), "png");
  equal(isMediaType("image/png", [".png"]), ".png");
  equal(isMediaType("image/png", ["text/*", "image/*"]), "image/png");
  equal(isMediaType("image/png", ["image/*", "text/*"]), "image/png");
  equal(isMediaType("image/png", ["image/*", "image/png"]), "image/png");
  equal(isMediaType("image/png", ["image/png", "image/*"]), "image/png");

  assertStrictEq(isMediaType("image/png", ["jpeg"]), false);
  assertStrictEq(isMediaType("image/png", [".jpeg"]), false);
  assertStrictEq(
    isMediaType("image/png", ["text/*", "application/*"]),
    false
  );
  assertStrictEq(
    isMediaType("image/png", ["text/html", "text/plain", "application/json"]),
    false
  );
});

test(function matchSuffix() {
  equal(
    isMediaType("application/vnd+json", ["+json"]),
    "application/vnd+json"
  );
  equal(
    isMediaType("application/vnd+json", ["application/vnd+json"]),
    "application/vnd+json"
  );
  equal(
    isMediaType("application/vnd+json", ["application/*+json"]),
    "application/vnd+json"
  );
  equal(
    isMediaType("application/vnd+json", ["*/vnd+json"]),
    "application/vnd+json"
  );
  assertStrictEq(
    isMediaType("application/vnd+json", ["application/json"]),
    false
  );
  assertStrictEq(
    isMediaType("application/vnd+json", ["text/*+json"]),
    false
  );
});

test(function starStarMatchesContentType() {
  equal(isMediaType("text/html", ["*/*"]), "text/html");
  equal(isMediaType("text/xml", ["*/*"]), "text/xml");
  equal(isMediaType("application/json", ["*/*"]), "application/json");
  equal(
    isMediaType("application/vnd+json", ["*/*"]),
    "application/vnd+json"
  );
});

test(function starStarInvalidMTReturnsFalse() {
  assertStrictEq(isMediaType("bogus", ["*/*"]), false);
});

test(function matchUrlEncoded() {
  equal(
    isMediaType("application/x-www-form-urlencoded", ["urlencoded"]),
    "urlencoded"
  );
  equal(
    isMediaType("application/x-www-form-urlencoded", ["json", "urlencoded"]),
    "urlencoded"
  );
  equal(
    isMediaType("application/x-www-form-urlencoded", ["urlencoded", "json"]),
    "urlencoded"
  );
});

test(function matchMultipartStar() {
  equal(
    isMediaType("multipart/form-data", ["multipart/*"]),
    "multipart/form-data"
  );
});

test(function matchMultipart() {
  equal(isMediaType("multipart/form-data", ["multipart"]), "multipart");
});
