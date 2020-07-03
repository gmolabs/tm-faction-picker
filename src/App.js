import React, { useState } from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import { BONUS_TILES, ROUND_TILES, COLORS, FACTIONS } from "./data.js";

let renderCount = 0;

function App() {
  renderCount++;
  const GAMESTATE_LENGTH = 119;
  const [gamestate, setGamestate] = useState(new Array(GAMESTATE_LENGTH).fill(0));
  const [predictions, setPredictions] = useState([]);
  const [model, setModel] = useState(null);
  var gamestateInputs = [];
  for (var i = 0; i < FACTIONS.length; i++) {
    gamestateInputs[i] = new Array(GAMESTATE_LENGTH).fill(0);
    //encode faction to predict for
    gamestateInputs[i][98 + i] = 1;
    //encode color for this faction
    var myColor = FACTIONS[i].color;
    var colorIndex = COLORS.indexOf(myColor);
    gamestateInputs[i][112 + colorIndex] = 1;
  }



  const handleGameStateChange = () => {
    makePrediction();
    console.log(gamestate)
  }

  const makePrediction = () => {
    console.log("making prediction");
    (async () => {
      const model = await tf.loadLayersModel('./model/model.json');
      setModel(model);
      const pred = tf.tidy(() => {
        const output = model.predict(tf.tensor(gamestateInputs));
        setPredictions(Array.from(output.dataSync()));
      });
    })();
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Render Counter: {renderCount}</p>
        <h2>Terra Mystica Faction Picker</h2>
        <h3>Load Game from Snellman (optional)</h3>
        <div><input type="text"></input><button>LOAD</button></div>
        <h3>Missing Bonus Tiles</h3>
        {/* 
        ~~~Checkbox UI~~~
        <ul class="inputList">
          {BONUS_TILES.map((x, y) => <li><input key={y} type='checkbox' />{x}</li>)}
        </ul> */}
        {[...Array(3)].map((x, i) =>
          <div key={i}><select id={"bonusSelect" + i} onChange={handleGameStateChange}><option key="blank">-</option>{BONUS_TILES.map((x, y) => <option key={y}>{x}</option>)}</select></div>
        )}
        <h3>Scoring Tiles</h3>
        {[...Array(6)].map((x, i) =>
          <div key={i}>Round {i + 1}: <select id={"roundSelect" + i} onChange={handleGameStateChange}><option key="blank">-</option>{ROUND_TILES.map((x, y) => <option key={y}>{x}</option>)}</select></div>
        )
        }
        <h3>Already Selected Factions</h3>

        {
          [...Array(3)].map((x, i) =>
            <div key={i}><select id={"factionSelect" + i} onChange={handleGameStateChange}><option>none</option>{FACTIONS.map((x, y) => <option key={y}>{x.faction}</option>)}</select></div>
          )
        }
        <h3>Predictions</h3>
        <div>
          <ul>
            {predictions.map((x, i) =>
              <li key={i}>{FACTIONS[i].faction} : {predictions[i]}</li>
            )}
          </ul>
        </div>
      </header >
    </div >
  );
}

export default App;
