import { useState, type FormEvent } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import amplifyOutputs from "./amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

// Configura Amplify
Amplify.configure(amplifyOutputs);

// Crea cliente Amplify Data
const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const prompt = formData.get("prompt")?.toString() || "";

      const { data, errors } = await amplifyClient.queries.askBedrock({
        prompt, // ✅ enviar el prompt como string
      });

      if (!errors) {
        setResult(data?.body || "No data returned");
      } else {
        console.error(errors);
        setResult("An error occurred while processing your prompt.");
      }
    } catch (e) {
      console.error(e);
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <h1 className="main-header">
          Gelpharma <br />
          <span className="highlight">Consultor Personal</span>
        </h1>
        <p className="description">
          Ingresa tu pregunta y te responderé
        </p>
      </div>
      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            id="prompt"
            name="prompt" // ✅ cambiar el name del input
            placeholder="Que te gustaría preguntar?"
          />
          <button type="submit" className="search-button">
            Ask
          </button>
        </div>
      </form>
      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loading...</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && <p className="result">{result}</p>
        )}
      </div>
    </div>
  );
}

export default App;
