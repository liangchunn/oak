// Copyright 2018-2019 the oak authors. All rights reserved. MIT license.
import { test } from "https://deno.land/std@v0.3.4/testing/mod.ts";
import { equal } from "https://deno.land/std@v0.3.4/testing/asserts.ts";
import { preferredMediaTypes } from "./mediaType.ts";

test(function testAcceptUndefined() {
  equal(preferredMediaTypes(), ["*/*"]);
});

test(function testAcceptStarStar() {
  equal(preferredMediaTypes("*/*"), ["*/*"]);
});

test(function testAcceptMediaType() {
  equal(preferredMediaTypes("application/json"), ["application/json"]);
});

test(function testAcceptMediaTypeQ0() {
  equal(preferredMediaTypes("application/json;q=0"), []);
});

test(function testAcceptMediaTypeLowQ() {
  equal(preferredMediaTypes("application/json;q=0.2, text/html"), [
    "text/html",
    "application/json"
  ]);
});

test(function testAcceptTextStar() {
  equal(preferredMediaTypes("text/*"), ["text/*"]);
});

test(function testAcceptComplexQ() {
  equal(
    preferredMediaTypes(
      "text/plain, application/json;q=0.5, text/html, */*;q=0.1"
    ),
    ["text/plain", "text/html", "application/json", "*/*"]
  );
});

test(function testAcceptSuperLong() {
  equal(
    preferredMediaTypes(
      "text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1"
    ),
    [
      "text/plain",
      "text/html",
      "text/xml",
      "text/yaml",
      "text/javascript",
      "text/csv",
      "text/css",
      "text/rtf",
      "text/markdown",
      "application/json",
      "application/octet-stream",
      "*/*"
    ]
  );
});

test(function testProvidedAcceptUndefined() {
  equal(preferredMediaTypes(undefined, ["text/html"]), ["text/html"]);
  equal(
    preferredMediaTypes(undefined, ["text/html", "application/json"]),
    ["text/html", "application/json"]
  );
  equal(
    preferredMediaTypes(undefined, ["application/json", "text/html"]),
    ["application/json", "text/html"]
  );
});

test(function testProvidedAcceptStarStar() {
  equal(preferredMediaTypes("*/*", ["text/html"]), ["text/html"]);
  equal(preferredMediaTypes("*/*", ["text/html", "application/json"]), [
    "text/html",
    "application/json"
  ]);
  equal(preferredMediaTypes("*/*", ["application/json", "text/html"]), [
    "application/json",
    "text/html"
  ]);
});

test(function testCaseInsensitive() {
  equal(preferredMediaTypes("application/json", ["application/JSON"]), [
    "application/JSON"
  ]);
});

test(function testOnlyReturnsValue() {
  equal(preferredMediaTypes("application/json", ["text/html"]), []);
  equal(
    preferredMediaTypes("application/json", ["text/html", "application/json"]),
    ["application/json"]
  );
});

test(function testProvidedButQ0() {
  equal(
    preferredMediaTypes("application/json;q=0", ["application/json"]),
    []
  );
});

test(function testProvidedAcceptsLowQ() {
  equal(
    preferredMediaTypes("application/json;q=0.2, text/html", [
      "application/json"
    ]),
    ["application/json"]
  );
  equal(
    preferredMediaTypes("application/json;q=0.2, text/html", [
      "application/json",
      "text/html"
    ]),
    ["text/html", "application/json"]
  );
  equal(
    preferredMediaTypes("application/json;q=0.2, text/html", [
      "text/html",
      "application/json"
    ]),
    ["text/html", "application/json"]
  );
});

test(function testTextStar() {
  equal(preferredMediaTypes("text/*", ["application/json"]), []);
  equal(
    preferredMediaTypes("text/*", ["application/json", "text/html"]),
    ["text/html"]
  );
  equal(
    preferredMediaTypes("text/*", ["text/html", "application/json"]),
    ["text/html"]
  );
});

test(function testProvidedPreferredOrder() {
  equal(
    preferredMediaTypes(
      "text/plain, application/json;q=0.5, text/html, */*;q=0.1",
      ["application/json", "text/plain", "text/html"]
    ),
    ["text/plain", "text/html", "application/json"]
  );
  equal(
    preferredMediaTypes(
      "text/plain, application/json;q=0.5, text/html, */*;q=0.1",
      ["image/jpeg", "text/html"]
    ),
    ["text/html", "image/jpeg"]
  );
  equal(
    preferredMediaTypes(
      "text/plain, application/json;q=0.5, text/html, */*;q=0.1",
      ["image/jpeg", "image/gif"]
    ),
    ["image/jpeg", "image/gif"]
  );
});

test(function testClientPreferredOrder() {
  equal(
    preferredMediaTypes(
      "text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1",
      [
        "text/plain",
        "text/html",
        "text/xml",
        "text/yaml",
        "text/javascript",
        "text/csv",
        "text/css",
        "text/rtf",
        "text/markdown",
        "application/json",
        "application/octet-stream"
      ]
    ),
    [
      "text/plain",
      "text/html",
      "text/xml",
      "text/yaml",
      "text/javascript",
      "text/csv",
      "text/css",
      "text/rtf",
      "text/markdown",
      "application/json",
      "application/octet-stream"
    ]
  );
});
