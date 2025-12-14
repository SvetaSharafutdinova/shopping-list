import * as mock from "./shoppingListApi.mock";
import * as real from "./shoppingListApi.real";

const mode = process.env.REACT_APP_API_MODE || "mock";
const api = mode === "real" ? real : mock;

export default api;
