import { test } from "node:test";
import assert from "node:assert/strict";
import { favoriteKey, parseFavorites, toggleFavorite, pageCount, pageSlice } from "./favorites.ts";

test("demo and real listing keys never collide", () => {
  assert.equal(favoriteKey({id:1,isDemo:true}),"demo:1");
  assert.equal(favoriteKey({id:1,isDemo:false}),"real:1");
});
test("saved favourites are validated and deduplicated", () => {
  assert.deepEqual(parseFavorites('["real:2","demo:1","real:2","admin",2]'),["real:2","demo:1"]);
  assert.deepEqual(parseFavorites("malformed"),[]);
  assert.deepEqual(parseFavorites('{"x":1}'),[]);
});
test("favourite toggles on and off without affecting other keys", () => {
  const item={id:3,isDemo:false};
  assert.deepEqual(toggleFavorite(["demo:3"],item),["demo:3","real:3"]);
  assert.deepEqual(toggleFavorite(["demo:3","real:3"],item),["demo:3"]);
});
test("pagination clamps boundaries and avoids out of range pages", () => {
  assert.equal(pageCount(0,6),1);
  assert.equal(pageCount(13,6),3);
  assert.deepEqual(pageSlice([1,2,3,4,5,6,7],2,3),[4,5,6]);
  assert.deepEqual(pageSlice([1,2,3,4,5,6,7],999,3),[7]);
  assert.deepEqual(pageSlice([],1,6),[]);
});
