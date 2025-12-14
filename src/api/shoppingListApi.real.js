import { request } from "./client";

export function list({ includeArchived }) {
  return request(`/shoppingList/list?includeArchived=${includeArchived ? "true" : "false"}`);
}

export function get({ id }) {
  return request(`/shoppingList/get?id=${encodeURIComponent(id)}`);
}

export function create({ name }) {
  return request(`/shoppingList/create`, { method: "POST", body: JSON.stringify({ name }) });
}

export function remove({ id }) {
  return request(`/shoppingList/delete`, { method: "POST", body: JSON.stringify({ id }) });
}
