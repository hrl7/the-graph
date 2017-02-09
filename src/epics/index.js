import { combineEpics } from "redux-observable";

import graphEpic from "./graph";

export default combineEpics(
  graphEpic 
);
