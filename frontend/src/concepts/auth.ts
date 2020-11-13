import { fromJS } from "immutable";

export const authorizeUser = () => (dispatch: any) => {};

export const checkLogin = () => (dispatch: any) => {};

// Reducer
const initState = fromJS({
  isLoggedIn: false,
});

export default (state = initState, action: any) => {
  switch (action.type) {
    case "auth/login": {
      return state.set("isLoggedIn", true);
    }
    default: {
      return state;
    }
  }
};
