import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as tf from '@tensorflow/tfjs';


function App() {
  const GAMESTATE_LENGTH = 119;
  var gamestate;
  var encodedGamestate;
  var predictions = 0;
  (async () => {
    const model = await tf.loadLayersModel(
      './model/model.json');
    //model.summary();
    gamestate = new Array(GAMESTATE_LENGTH).fill(0);
    encodedGamestate = tf.tensor(gamestate);
    encodedGamestate = encodedGamestate.reshape([1, GAMESTATE_LENGTH]);
    //console.log(encodedGamestate);
    const pred = tf.tidy(() => {
      const output = model.predict(encodedGamestate);
      predictions = Array.from(output.dataSync());
      console.log(predictions);
    });
  })();
  return (
    <div className="App">

      <h1>Terra Mystica Faction Picker</h1>
      <form><button>Pick Faction</button></form>
      <h2 id="suggestion">{predictions}</h2>
      {/* <header className="App-header">
        <h1>Terra Mystica Faction Picker</h1>
        <form><button>Pick Faction</button></form>
        <div id="suggestion"></div>
        <img src={logo} className="App-logo" alt="logo" />
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
        </a>
      </header> */}
    </div>
  );
}

export default App;
