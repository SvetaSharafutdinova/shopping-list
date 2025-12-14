import { mockLists, mockDetails } from "../mock/mockData";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function list({ includeArchived }) {
  await wait(200);
  const data = includeArchived ? mockLists : mockLists.filter((x) => !x.isArchived);
  return { itemList: data };
}

export async function get({ id }) {
  await wait(200);
  const data = mockDetails[id];
  if (!data) throw new Error("List not found");
  return data;
}

export async function create({ name }) {
  await wait(200);
  return { id: `l_${Date.now()}`, name, isArchived: false, role: "OWNER", itemCount: 0 };
}

export async function remove({ id }) {
  await wait(200);
  return { id };
}
