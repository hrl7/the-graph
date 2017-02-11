// @flow

import {loadGraph} from './actions/graph';

export default class Injector {
  constructor(store) {
    this.store = store;
  }

// Clock
// script.src = 'https://api.github.com/gists/7135158?callback=loadGraph';
// script.src = 'clock.json.js';
// Gesture object building (lots of ports!)
// script.src = 'https://api.github.com/gists/7022120?callback=loadGraph';
// Gesture data gathering (big graph)
// script.src = 'https://api.github.com/gists/7022262?callback=loadGraph';
// Edge algo test
// script.src = 'https://api.github.com/gists/6890344?callback=loadGraph';

  loadGraph(url: string) {
    this.store.dispatch(loadGraph(url));
  }

  setTheme(theme: string): void {

  }

  autoLayout(): void {

  }
}

