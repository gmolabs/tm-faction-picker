import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import './App.css';
import * as tf from '@tensorflow/tfjs';
import { BONUS_TILES, ROUND_TILES, COLORS, FACTIONS } from "./data.js";

let renderCount = 0;


function App() {
  renderCount++;
  const GAMESTATE_LENGTH = 119;
  const { register, handleSubmit, watch, errors } = useForm();
  // const [gamestate, setGamestate] = useState(null);
  const onSubmit = data => {
    //setGamestate(data);
    //makePrediction();
  }
  const [predictions, setPredictions] = useState([]);
  const [model, setModel] = useState(null);
  const [sortedPredictions, setSortedPredictions] = useState([]);


  const fetchGameState = () => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var game_state = JSON.parse(xhr.response);
        setRoundScoreTiles(game_state.events.global);
        setMissingBonusTiles(game_state.ledger);
      }
    };
    // instead of having a backend, we proxy the HTTP request with cors-anywhere
    xhr.open("POST", "https://cors-anywhere.herokuapp.com/https://terra.snellman.net/app/view-game/");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // payload must be e.g. "game=4pLeague_S26_D6L10_G4".
    var payload = "game=" + document.getElementById("game_id").value;
    xhr.send(payload);
  }

  // most elements of the input are garbage, but we look for e.g. round 2 had scoring tile 3:
  // {SCORE3 : {round : {2: 1, all: 1}}
  const setRoundScoreTiles = (global_events) => {
    var i;
    var score;
    var round;
    let select_elem;
    for (i = 0; i < 20; i++) {
      let maybe_key = 'SCORE' + i;
      score = global_events[maybe_key];
      if (score) {
	// Maybe this shows up first? let's not rely on order.
        delete score.round.all;
        round = Object.keys(score.round)[0];
        select_elem = document.getElementsByName('round' + round)[0];
        select_elem.value = i - 1;
      }
    }
  }

  const setMissingBonusTiles = (ledger) => {
    let num_removed = 0;
    let bon_num;
    let comment;
    let select_elem;
    for (i = 0; i < ledger.length; i++) {
      comment = ledger[i].comment;
      if (comment && comment.startsWith("Removing tile BON") {
        bon_num = parseInt(comment[comment.length - 1]);
        select_elem = document.getElementsByName('bonus' + num_removed + 1)[0];
        select_elem.value = bon_num - 1;
        num_removed++;
      }
    }
  }

  const makePrediction = () => {

    //first three elements of gamestate: missing bonus tiles by index
    //next 6 are round scoring tiles by index
    //last three are already-selected factions by index ("none" if not selected)

    let gamestate = [watch("bonus1"), watch("bonus2"), watch("bonus3"), watch("round1"), watch("round2"), watch("round3"), watch("round4"), watch("round5"), watch("round6"), watch("fact1"), watch("fact2"), watch("fact3")];
    console.log(gamestate);
    let onehot = new Array(GAMESTATE_LENGTH).fill(0);

    //first 10 digits of onehot encoding get a 1 if indexed bonus tile is missing
    //index 0-9
    onehot[gamestate[0]] = 1;
    onehot[gamestate[1]] = 1;
    onehot[gamestate[2]] = 1;

    //index 10-18
    //next 9 digits get a 1 if indexed round tile is missing
    //first set all to 1...
    for (let i = 10; i < 19; i++) {
      onehot[i] = 1;
    }
    //...then set to 0 if round tile is found in gamestate
    for (let i = 3; i < 9; i++) {
      if (gamestate[i] !== "-") {
        onehot[parseInt(gamestate[i]) + 10] = 0;
      }
    }
    console.log(onehot);

    //index 19-72
    //next 6*9=54 bits are onehot encoding of round bonus tiles. 
    for (let i = 0; i < 6; i++) {
      onehot[parseInt(gamestate[i + 3]) + 19 + (i * 9)] = 1;
    }

    //index 73-86
    //onehot encoding of previously selected factions
    for (let i = 0; i < 3; i++) {
      if (gamestate[i + 9] !== "none") {
        onehot[parseInt(gamestate[i + 9]) + 73] = 1;
      }
    }

    //index 87-93
    //onehot encoding of previously selected colors
    let prevColors = [];
    for (let i = 0; i < 3; i++) {
      if (gamestate[i + 9] !== "none") {
        prevColors[i] = COLORS.indexOf(FACTIONS[parseInt(gamestate[i + 9])].color);
      }
      onehot[parseInt(prevColors[i]) + 87] = 1;
    }

    //index 94-97
    //onehot encoding of your player number
    let nPrevPlayers = 0;
    for (let i = 0; i < 3; i++) {
      if (gamestate[i + 9] !== "none") {
        nPrevPlayers++;
      }
    }
    onehot[nPrevPlayers + 94] = 1;



    //console.log(onehot);
    let gamestateInputs = [];
    for (let i = 0; i < FACTIONS.length; i++) {
      //      gamestateInputs[i] = new Array(GAMESTATE_LENGTH).fill(0);
      gamestateInputs[i] = Array.from(onehot);
      //encode faction to predict for
      gamestateInputs[i][98 + i] = 1;
      //encode color for this faction
      var myColor = FACTIONS[i].color;
      var colorIndex = COLORS.indexOf(myColor);
      gamestateInputs[i][112 + colorIndex] = 1;
    }

    (async () => {
      const model = await tf.loadLayersModel('./model/model.json');
      setModel(model);
      const pred = tf.tidy(() => {
        const output = model.predict(tf.tensor(gamestateInputs));
        let sortedPredictions = Array.from(output.dataSync());
        let unavailableColors = [];

        for (let i = 0; i < 3; i++) {
          if (gamestate[i + 9] !== "none") {
            unavailableColors.push(FACTIONS[parseInt(gamestate[i + 9])].color);
          }
        }
        // console.log("unavailable colors: " + unavailableColors);
        for (let i = 0; i < sortedPredictions.length; i++) {
          sortedPredictions[i] = { fact: FACTIONS[i].faction, color: FACTIONS[i].color, score: sortedPredictions[i], class: (unavailableColors.includes(FACTIONS[i].color) ? "unavailable" : FACTIONS[i].color) }
        }
        sortedPredictions.sort((a, b) => (a.score < b.score) ? 1 : -1);

        console.log(sortedPredictions);
        setPredictions(sortedPredictions);
      });
    })();
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <p>Render Counter: {renderCount}</p> */}
        {/* <h2>Terra Mystica Faction Picker</h2> */}
        <h3>Load Game from Snellman</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div><input id="game_id" type="text" value="4pLeague_S26_D6L10_G4"></input><button onClick={fetchGameState}>LOAD</button></div>
          <h3>Missing Bonus Tiles</h3>
          {/* 
        ~~~Checkbox UI~~~
        <ul class="inputList">
          {BONUS_TILES.map((x, y) => <li><input key={y} type='checkbox' />{x}</li>)}
        </ul> */}
          {[...Array(3)].map((x, i) =>
            <div key={i}><select name={"bonus" + (i + 1)} ref={register} onChange={makePrediction}><option key="blank" value="-">-</option>{BONUS_TILES.map((x, y) => <option key={y} value={y}>{x}</option>)}</select></div>
          )}
          <h3>Scoring Tiles</h3>
          {[...Array(6)].map((x, i) =>
            <div key={i}>Round {i + 1}: <select name={"round" + (i + 1)} ref={register} onChange={makePrediction}><option key="blank" value="-">-</option>{ROUND_TILES.map((x, y) => <option key={y} value={y}>{x}</option>)}</select></div>
          )
          }
          <h3>Already Selected Factions</h3>

          {
            [...Array(3)].map((x, i) =>
              <div key={i}><select name={"fact" + (i + 1)} ref={register} onChange={makePrediction}><option key="blank" value="none">none</option>{FACTIONS.map((x, y) => <option key={y} value={y}>{x.faction}</option>)}</select></div>
            )
          }
          <h3>Predictions</h3>

          {/* <input type="submit" /> */}
        </form>
        <div>
          <table id="predictionsList">
            <tbody>
              {predictions.map((x, i) =>
                <tr key={i} className={x.class}><td>{x.fact}</td><td>
                  {x.score.toFixed(3)}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </header >
    </div >
  );
}

export default App;
