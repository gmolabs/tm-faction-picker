import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as tf from '@tensorflow/tfjs';


function App() {
  (async () => {
    const model = await tf.loadLayersModel(
      './model/model.json');
    model.summary();
  })();
  return (
    <div className="App">
      <header className="App-header">
        <h1>Terra Mystica Faction Picker</h1>
        <form><button>Suggest Faction</button></form>
        <div id="suggestion"></div>
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
