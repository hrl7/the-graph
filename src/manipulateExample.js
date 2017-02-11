
          // Simulate a library update
          /*
    setTimeout(() => {
      const originalComponent = editor.getComponent('core/Split');
      if (!originalComponent) {
        console.warn('Didn\'t find component. Something is amiss.');
        return;
      }
      const component = JSON.parse(JSON.stringify(originalComponent));
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
    */

    // Simulate node icon updates

    const iconKeys = Object.keys(TheGraph.FONT_AWESOME);
    window.setInterval(() => {
      if (!editor.fbpGraph) {
        return;
      }
      const nodes = editor.fbpGraph.nodes;
      if (nodes.length > 0) {
        const randomNodeId = nodes[Math.floor(Math.random() * nodes.length)].id;
        const randomIcon = iconKeys[Math.floor(Math.random() * iconKeys.length)];
        editor.updateIcon(randomNodeId, randomIcon);
      }
    }, 1000);

          // Simulate un/triggering wire animations
    let animatingEdge1 = null;
    let animatingEdge2 = null;
    window.setInterval(() => {
      if (!editor.fbpGraph) {
        return;
      }
      if (animatingEdge2) {
        editor.unanimateEdge(animatingEdge2);
      }
      if (animatingEdge1) {
        animatingEdge2 = animatingEdge1;
      }
      const edges = editor.fbpGraph.edges;
      if (edges.length > 0) {
        animatingEdge1 = edges[Math.floor(Math.random() * edges.length)];
        editor.animateEdge(animatingEdge1);
      }
    }, 2014);

          // Simulate un/triggering errors
    let errorNodeId = null;
    const makeRandomError = function () {
      if (!editor.fbpGraph) {
        return;
      }
      if (errorNodeId) {
        editor.removeErrorNode(errorNodeId);
      }
      const nodes = editor.fbpGraph.nodes;
      if (nodes.length > 0) {
        errorNodeId = nodes[Math.floor(Math.random() * nodes.length)].id;
        editor.addErrorNode(errorNodeId);
        editor.updateErrorNodes();
      }
    };
    window.setInterval(makeRandomError, 3551);
    makeRandomError();
