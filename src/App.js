import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as tf from '@tensorflow/tfjs';


function App() {
  const GAMESTATE_LENGTH = 119;
  const BONUS_TILES = [
    "BON1: SPD +2C",
    "BON2: CULT +4C",
    "BON3: +6C",
    "BON4: +3PW 1SHIP",
    "BON5: +1W +3PW",
    "BON6: pass-vp:SA*4,SH*4  +2W",
    "BON7: pass-vp:TP*2 +1W",
    "BON8: +1P",
    "BON9: pass-vp:D*1 +2C",
    "BON10: pass-vp:ship*3 +3PW"
  ];
  const ROUND_TILES = [
    "SCORE1: SPD>>2vp, 1EARTH->1C",
    "SCORE2: TOWN>>5vp, 4EARTH->1SPD",
    "SCORE3: D>>2vp, 4WATER->1P",
    "SCORE4: SA/SH>>5vp, 2FIRE->1W",
    "SCORE5: D>>2vp, 4FIRE->4PW",
    "SCORE6: TP>>3vp, 4WATER->1SPD",
    "SCORE7: SA/SH>>5vp, 2AIR->1W",
    "SCORE8: TP>>3vp, 4AIR->1SPD",
    "SCORE9: TE>>4vp, 1CULT->2C"
  ];
  const COLORS = [
    "black",
    "blue",
    "brown",
    "gray",
    "green",
    "red",
    "yellow"
  ];
  const FACTIONS = [
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
  ];
  var gamestate;
  var encodedGamestate;
  var predictions;
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
      <header className="App-header">
        <h1>Terra Mystica Faction Picker</h1>
        <h2>Available Bonus Tiles</h2>
        <ul class="inputList">
          {BONUS_TILES.map((x, y) => <li><input key={y} type='checkbox' />{x}</li>)}
        </ul>
        <h2>Scoring Tiles</h2>
        <ul>
          {[...Array(6)].map((x, i) =>
            <div>Round {i + 1}: <select><option></option>{ROUND_TILES.map((x, y) => <option key={y}>{x}</option>)}</select></div>
          )}
          {/* <div>Round 1: <select>{ROUND_TILES.map((x, y) => <option key={y}>{x}</option>)}</select></div> */}
        </ul>
        <h2>Already Selected Factions</h2>
        <ul class="inputList">
          {FACTIONS.map((x, y) => <li><input key={y} type='checkbox' />{x.faction}</li>)}
        </ul>

        {/* <form><button>Pick Faction</button></form> */}
        <h2>Predictions</h2>
      </header>
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
    </div >
  );
}

export default App;
