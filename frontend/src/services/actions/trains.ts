import { message } from "antd";
import { Dispatch } from "redux";
import { getTrainInstancesList, getTrainsList } from "../api";
import { TRAIN_LOADING, FETCH_TRAINS_SUCCESS, TRAIN_INSTANCE_LOADING, TRAIN_INSTANCE_LOADING_SUCCESS } from "../constants";

/**
 * Action to fetch the trains list
 */
export const getTrains = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: TRAIN_LOADING });
    let res = await getTrainsList();
    dispatch({ type: FETCH_TRAINS_SUCCESS, trainsList: res.data.data });
  } catch (err) {
    console.log(err);
    message.error('Something went wrong while fetching trains!', 2);
  }
}

/**
 * Action to fetch the train instances for a particular train number
 */
export const getTrainInstance = (trainNumber: String) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: TRAIN_INSTANCE_LOADING, trainNumber });
    let res = await getTrainInstancesList(trainNumber);
    dispatch({ type: TRAIN_INSTANCE_LOADING_SUCCESS, trainInstances: res.data.instances, trainNumber: trainNumber });
  } catch (err) {
    console.log(err);
    message.error('Something went wrong while fetching booking instance!', 2);
  }
}
