import Debug from "debug";
import { combineEpics } from "redux-observable";
import axios from "axios";

import { loadGraph, graphLoading, graphLoaded } from "../actions/graph";
import Act from "../actions/Types";

const debug = Debug("graph:epic:device");

function loadGraphEpic(action$, store){
  return action$.ofType(Act.LOAD_GRAPH)
    .map(action => {
      axios.get(action.payload)
      .then(res => {
        debug(res);
        if(typeof res.data === "object") {
          store.dispatch(graphLoaded(res.data));
        } else {
          store.dispatch(failedToLoadGraph(res))
        }
      });
      return graphLoading();
    })
    ;
}

export default combineEpics(loadGraphEpic);