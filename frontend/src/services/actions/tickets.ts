import { Dispatch } from "redux";
import { getCitiesList } from "../api";
import { FETCH_CITIES } from "../constants";


/**
 * Action to get cities
 */
export const getCities = () => async (dispatch: Dispatch) => {
    try {
        let resp = await getCitiesList();
        dispatch({ type: FETCH_CITIES, cities: resp.data.cities })
    } catch (err) {

    }
}

