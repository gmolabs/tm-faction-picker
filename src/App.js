import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as tf from '@tensorflow/tfjs';


function App() {
  const GAMESTATE_LENGTH = 119;
  const COLORS = [
    "black", "blue", "brown", "gray", "green", "red", "yellow"
  ]
  const FACTIONS =
    [
      {
        faction: "Alchemists",
        color: "black"
      },
      {
        faction: "Auren",
        color: "green"
      },
      {
        faction: "Chaos Magicians",
        color: "red"
      },
      {
        faction: "Cultists",
        color: "brown"
      },
      {
        faction: "Darklings",
        color: "black"
      },
      {
        faction: "Dwarves",
        color: "gray"
      },
      {
        faction: "Engineers",
        color: "gray"
      },
      {
        faction: "Fakirs",
        color: "yellow"
      },
      {
        faction: "Giants",
        color: "red"
      },
      {
        faction: "Halflings",
        color: "brown"
      },
      {
        faction: "Mermaids",
        color: "blue"
      },
      {
        faction: "Nomads",
        color: "yellow"
      },
      {
        faction: "Swarmlings",
        color: "blue"
      },
      {
        faction: "Witches",
        color: "green"
      }
    ]
  var gamestate;
  var encodedGamestate;
  var predictions = 0;
  (async () => {
    const model = await tf.loadLayersModel(
      './model/model.json');
    //model.summary();

    gamestate = [];
    for (var i = 0; i < FACTIONS.length; i++) {
      gamestate[i] = new Array(GAMESTATE_LENGTH).fill(0);
      //encode faction to predict for
      gamestate[i][98 + i] = 1;
      //encode color for this faction
      var myColor = FACTIONS[i].color;
      var colorIndex = COLORS.indexOf(myColor);
      gamestate[i][112 + colorIndex] = 1;
    }
    encodedGamestate = tf.tensor(gamestate);

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
