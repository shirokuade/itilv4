import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
const e = React.createElement;

function App() {
  return e('div', { style: { padding: '20px', fontFamily: 'sans-serif' } },
    e('h1', null, 'ITIL Mock Exam'),
    e('p', null, 'This is a placeholder build. For full functionality, build with Vite locally.'));
}

const root = document.getElementById("root");
ReactDOM.render(e(App), root);
