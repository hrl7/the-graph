import Act from "../actions/Types";

const InitialState = {
  graph: null,
  loading: false
};

export default function graphReducer(state=InitialState, action){
  switch(action.type) {
    case Act.LOAD_GRAPH_WAITING:
      return {...state, loading: true};
    case Act.LOAD_GRAPH_SUCCESS:
      return {...state, graph: action.payload, loading: false};
    default: 
      return state;
  }
}