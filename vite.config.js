export default {
    root: '.',
    base: '/my-graphics-demos/',
    build: {
        rollupOptions: {
          input: {
            main: './index.html',
            sequencer: './sequencer.html',
            treebuilder: './treebuilder.html',
            fractalviewer: './fractalviewer.html'
          },
        },
      },
};