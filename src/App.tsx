import React, { useReducer } from "react";
import logo from "./logo.svg";
import "./App.css";

type State =
  | {
      phase: "pre-game";
    }
  | {
      phase: "in-game";
      goal: string;
      guess: string;
    }
  | {
      phase: "post-game";
      goal: string;
    };

type Action =
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string };

function getInitialState(): State {
  return { phase: "pre-game" };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start-game": {
      if (state.phase === "in-game") {
        return state;
      }

      return {
        phase: "in-game",
        goal: "abced",
        guess: "",
      };
    }
    case "update-guess": {
      if (state.phase !== "in-game") {
        return state;
      }
      if (action.newGuess === state.goal) {
        return { phase: "post-game", goal: state.goal };
      }
      return { ...state, guess: action.newGuess };
    }
  }
  return state;
}

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  switch (state.phase) {
    case "pre-game": {
      return (
        <div>
          <button
            onClick={() =>
              dispatch({
                type: "start-game",
              })
            }
          >
            Begin new game.
          </button>

          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );
    }
    case "in-game": {
      return (
        <div>
          <div>Goal: {state.goal}</div>
          <label>
            Guess:
            <input
              type="text"
              value={state.guess}
              onChange={(ev) =>
                dispatch({
                  type: "update-guess",
                  newGuess: ev.target.value,
                })
              }
            />
          </label>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );
    }
    case "post-game": {
      return (
        <div>
          <div>Nice Game! You guessed {state.goal}</div>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Begin new game.
          </button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );
    }
  }
  return null;
}

export default App;
