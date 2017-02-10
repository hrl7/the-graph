// @flow

import "rxjs";
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { createEpicMiddleware } from "redux-observable";

import TheGraphEditor from './components/editor';
import TheGraphEditorStore from '../the-graph-editor/theGraphEditorStore';
import * as reducers from "./reducers";
import rootEpic from "./epics";
import TheGraphNav from './components/nav';
import Injector from "./injector.js";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware(rootEpic);
const reducer = combineReducers({
  ...reducers
});

const store = createStore(reducer,
  composeEnhancers(applyMiddleware(epicMiddleware)));

window.api = new Injector(store);
window.store = store;
window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('mount-point');
  ReactDOM.render(
    <Provider store={store}>
    <div>
      <TheGraphEditor id="editor" store={store}/>

      <TheGraphNav id="nav" width="216" height="162" />

      <div id="testing">
        <button id="autolayout">autolayout</button>
        <button id="theme">theme</button>
        <button id="focus">focus</button>
        <button id="refresh">refresh</button>
      </div>
      {store.getState().graph.loading ? <div id="loading" style={{position: 'absolute', top: '10px', left: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px'}}>
        <img src="assets/loading.gif"/>
        <div id="loading-message">loading graph data...</div>
      </div> : null}
    </div>
    </Provider>, root);


/*

1. load graph
2. remove loading message
3. init nav ?


*/
      // Autolayout button
    document.getElementById('autolayout').addEventListener('click', () => {
      api.autolayout();
    });

    // Toggle theme
    let theme = 'dark';
    document.getElementById('theme').addEventListener('click', () => {
      theme = (theme === 'dark' ? 'light' : 'dark');
      api.setTheme(theme);
    });

    // Focus a node
    document.getElementById('focus').addEventListener('click', () => {
      const nodes = editor.fbpGraph.nodes;
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      editor.focusNode(randomNode);
    });

    // Refresh graph
    document.getElementById('refresh').addEventListener('click', () => {
      api.loadGraph("assets/photobooth.json");
    });

  api.loadGraph("assets/photobooth.json");

  // Resize to fill window and also have explicit w/h attributes
  /* TODO: propagate resize event
  const editor = document.getElementById('editor');
  const resize = () => {
    editor.setAttribute('width', window.innerWidth);
    editor.setAttribute('height', window.innerHeight);
  };
  window.addEventListener('resize', resize);
  resize();
  */
});
