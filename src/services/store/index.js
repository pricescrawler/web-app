import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import thunk from "redux-thunk";

import productsReducer from "./products/productsReducer";

const rootReducer = combineReducers({
  products: productsReducer,
  product: productsReducer,
  productList: productsReducer,
});


const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
