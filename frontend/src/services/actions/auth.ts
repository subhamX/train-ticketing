import { message } from "antd";
import { Dispatch } from "redux";
import { getUserData, sendLogOutSignal } from "../api";
import { ERROR_OCCURED, LOADING_END, LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../constants";

/**
 * Action to update the user instance in the store 
 */
export const checkUserAuthStatus = () => async (dispatch: Dispatch) => {
  try {
    let res = await getUserData();
    if (res.data.error === false) {
      // user is logged in
      console.log("User is authenticated")
      dispatch({ type: LOGIN_SUCCESS, payload: res.data.user });
    } else {
      console.log("User not authenticated")
    }
    dispatch({ type: LOADING_END });
  } catch (err) {
    console.log(err);
    message.error('Something went wrong! All functionalities might not work', 2);
    setTimeout(() => {
      dispatch({ type: ERROR_OCCURED, message: 'Sorry! Something went wrong.' });
    }, 800);
  }
}



/**
 * Action to logout the user
 */
export const logoutUser = () => async (dispatch: Dispatch) => {
  try {
    let res = await sendLogOutSignal();
    if (res.data.error === false) {
      // user is successfully logged out
      dispatch({ type: LOGOUT_SUCCESS })
      message.success('Logout Successful', 2);
    } else {
      throw Error(res.data.message)
    }
  } catch (err) {
    console.log(err);
    message.error('Something went wrong!', 2);
  }
}