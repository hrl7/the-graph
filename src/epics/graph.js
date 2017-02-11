import Debug from 'debug';
import {combineEpics} from 'redux-observable';
import axios from 'axios';
import 'babel-polyfill';

import FBPGraph from 'fbp-graph';

import {loadGraph, graphLoading, graphLoaded} from '../actions/graph';
import Act from '../actions/Types';

const debug = Debug('graph:epic:graph');

const loadJSON = async graphJSON => {
  return new Promise((resolve, reject) => {
    FBPGraph.graph.loadJSON(graphJSON, (err, graph) => {
      if (err) {
        reject(err);
        return;
      }
      debug(graph);
      resolve(graph);
    });
  });
};

function loadGraphEpic(action$, store) {
  return action$.ofType(Act.LOAD_GRAPH)
    .map(action => {
      axios.get(action.payload)
      .then(async res => {
        if (typeof res.data === 'object') {
          store.dispatch(graphLoaded(await loadJSON(res.data)));
        } else {
          store.dispatch(failedToLoadGraph(res));
        }
      });
      return graphLoading();
    })
    ;
}

export default combineEpics(loadGraphEpic);
