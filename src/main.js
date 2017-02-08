// @flow
  // Polymer.veiledElements = ["the-graph-editor"];
import React from 'react';
import ReactDOM from 'react-dom';

import TheGraphEditor from '../the-graph-editor/the-graph-editor';
import TheGraphEditorStore from '../the-graph-editor/theGraphEditorStore';

import TheGraphNav from '../the-graph-nav/the-graph-nav';

const store = new TheGraphEditorStore({
	width: 800, height: 600, grid: 72, snap: 36, theme: 'dark'
});
window.store = store;
window.addEventListener('DOMContentLoaded', function () {
	const root = document.getElementById('mount-point');
	ReactDOM.render(
    <div>
     <TheGraphEditor id="editor" store={store}/>

    <TheGraphNav id="nav" width="216" height="162" />

    <div id="testing">
      <button id="autolayout">autolayout</button>
      <button id="theme">theme</button>
      <button id="focus">focus</button>
      <button id="refresh">refresh</button>
    </div>
    <div id="loading" style={{position: 'absolute', top: '10px', left: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px'}}>
      <img src="assets/loading.gif"/>
      <div id="loading-message">loading custom elements...</div>
    </div>
    </div>, root);

// Remove loading message
	var loadingMessage = document.getElementById('loading-message');
	loadingMessage.innerHTML = 'loading graph data...';

	window.loadGraph = function (json) {
// Remove loading message
		var loading = document.getElementById('loading');
		loading.parentNode.removeChild(loading);
// Load graph
		var editor = document.getElementById('editor');
		var graph = json.data ? JSON.parse(json.data.files['noflo.json'].content) : json;
		var graphString = JSON.stringify(graph);
		editor.graph = graph;

          // Attach editor to nav
		var nav = document.getElementById('nav');
		nav.editor = editor;

          // Simulate a library update
		setTimeout(function () {
			var originalComponent = editor.getComponent('core/Split');
			if (!originalComponent) {
				console.warn('Didn\'t find component. Something is amiss.');
				return;
			}
			var component = JSON.parse(JSON.stringify(originalComponent));
			component.icon = 'github';
			component.inports.push({
				name: 'supercalifragilisticexpialidocious',
				type: 'boolean'
			});
			component.outports.push({
				name: 'boo',
				type: 'boolean'
			});
			editor.registerComponent(component);
		}, 1000);

          // Simulate node icon updates
          /*
          var iconKeys = Object.keys(TheGraph.FONT_AWESOME);
          window.setInterval(function () {
            if (!editor.fbpGraph) { return; }
            var nodes = editor.fbpGraph.nodes;
            if (nodes.length>0) {
              var randomNodeId = nodes[Math.floor(Math.random()*nodes.length)].id;
              var randomIcon = iconKeys[Math.floor(Math.random()*iconKeys.length)];
              editor.updateIcon(randomNodeId, randomIcon);
            }
          }, 1000);
          */

          // Simulate un/triggering wire animations
		var animatingEdge1 = null;
		var animatingEdge2 = null;
		window.setInterval(function () {
			if (!editor.fbpGraph) {
				return;
			}
			if (animatingEdge2) {
				editor.unanimateEdge(animatingEdge2);
			}
			if (animatingEdge1) {
				animatingEdge2 = animatingEdge1;
			}
			var edges = editor.fbpGraph.edges;
			if (edges.length > 0) {
				animatingEdge1 = edges[Math.floor(Math.random() * edges.length)];
				editor.animateEdge(animatingEdge1);
			}
		}, 2014);

          // Simulate un/triggering errors
		var errorNodeId = null;
		var makeRandomError = function () {
			if (!editor.fbpGraph) {
				return;
			}
			if (errorNodeId) {
				editor.removeErrorNode(errorNodeId);
			}
			var nodes = editor.fbpGraph.nodes;
			if (nodes.length > 0) {
				errorNodeId = nodes[Math.floor(Math.random() * nodes.length)].id;
				editor.addErrorNode(errorNodeId);
				editor.updateErrorNodes();
			}
		};
		window.setInterval(makeRandomError, 3551);
		makeRandomError();

          // Autolayout button
		document.getElementById('autolayout').addEventListener('click', function () {
			editor.triggerAutolayout();
		});

          // Toggle theme
		var theme = 'dark';
		document.getElementById('theme').addEventListener('click', function () {
			theme = (theme === 'dark' ? 'light' : 'dark');
			editor.theme = theme;
		});

          // Focus a node
		document.getElementById('focus').addEventListener('click', function () {
			var nodes = editor.fbpGraph.nodes;
			var randomNode = nodes[Math.floor(Math.random() * nodes.length)];
			editor.focusNode(randomNode);
		});

          // Refresh graph
		document.getElementById('refresh').addEventListener('click', function () {
			if (!editor.fbpGraph) {
				return;
			}
			editor.graph = JSON.parse(graphString);
		});

          // Log some stuff
		window.editor = editor;
		console.log(editor);
	};
	var body = document.querySelector('body');
	var script = document.createElement('script');
	script.type = 'application/javascript';
        // Clock
        // script.src = 'https://api.github.com/gists/7135158?callback=loadGraph';
        // script.src = 'clock.json.js';
	script.src = 'assets/photobooth.json.js';
        // Gesture object building (lots of ports!)
        // script.src = 'https://api.github.com/gists/7022120?callback=loadGraph';
        // Gesture data gathering (big graph)
        // script.src = 'https://api.github.com/gists/7022262?callback=loadGraph';
        // Edge algo test
        // script.src = 'https://api.github.com/gists/6890344?callback=loadGraph';
	body.appendChild(script);

        // Resize to fill window and also have explicit w/h attributes
	var editor = document.getElementById('editor');
	var resize = function () {
		editor.setAttribute('width', window.innerWidth);
		editor.setAttribute('height', window.innerHeight);
	};
	window.addEventListener('resize', resize);

	resize();
});
