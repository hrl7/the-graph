import { createAction } from "redux-actions";

import Act from "./Types";

export const loadGraph = createAction(Act.LOAD_GRAPH);
export const graphLoading = createAction(Act.LOAD_GRAPH_WAITING);
export const graphLoaded = createAction(Act.LOAD_GRAPH_SUCCESS);
export const failedToLoadGraph = createAction(Act.LOAD_GRAPH_ERROR);
