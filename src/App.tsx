import { useEffect, useReducer } from "react";
import normalizeString from "./util/normalizeString";
import getRandomElement from "./util/getRandomElement";
import "./App.css";

type State = Readonly<
  | {
      phase: "pre-game";
      wordPack: readonly string[] | null;
    }
  | {
      phase: "in-game";
      goal: string;
      guess: string;
      wordPack: readonly string[] | null;
    }
  | {
      phase: "post-game";
      goal: string;
      wordPack: readonly string[] | null;
    }
>;

type Action =
  | { type: "load-data"; wordPack: readonly string[] }
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string };

function getInitialState(): State {
  return { phase: "pre-game", wordPack: null };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "load-data": {
      if (state.phase !== "pre-game") {
        return state;
      }
      return { ...state, wordPack: action.wordPack };
    }
    case "start-game": {
      if (state.phase === "in-game") {
        return state;
      }

      const { wordPack } = state;
      if (wordPack == null) {
        return state;
      }

      return {
        phase: "in-game",
        goal: getRandomElement(wordPack),
        guess: "",
        wordPack,
      };
    }
    case "update-guess": {
      if (state.phase !== "in-game") {
        return state;
      }
      if (normalizeString(action.newGuess) === state.goal) {
        return {
          phase: "post-game",
          goal: state.goal,
          wordPack: state.wordPack,
        };
      }
      return { ...state, guess: action.newGuess };
    }
    case "load-data": {
      if (state.phase === "pre-game") {
        return { ...state, wordPack: action.wordPack };
      }
      return state;
    }
  }
  return state;
}

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  useEffect(() => {
    fetch("fruits.txt")
      .then((response) => response.text())
      .then((text) => {
        setTimeout(
          () =>
            dispatch({
              type: "load-data",
              wordPack: text
                .split("\n")
                .map(normalizeString)
                .filter(Boolean),
            }),
          3000,
        );
      });
  }, []);

  let content = null;
  switch (state.phase) {
    case "pre-game": {
      if (state.wordPack == null) {
        content = <>Loading data</>;
        break;
      }
      content = (
        <>
          <div>Word pack is ready with {state.wordPack.length} words.</div>
          <button
            onClick={() =>
              dispatch({
                type: "start-game",
              })
            }
          >
            Begin new game.
          </button>
        </>
      );
      break;
    }
    case "in-game": {
      content = (
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
        </div>
      );
      break;
    }
    case "post-game": {
      content = (
        <div>
          <div>Nice Game! You guessed {state.goal}</div>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Begin new game.
          </button>
        </div>
      );
    }
  }
  return (
    <div>
      {content}
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export default App;
