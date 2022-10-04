import React, {useEffect} from "react";
import logo from "./logo.svg";
import "./App.css";
import Table from "./components/Table";

function App() {
  return (
    <div className="App">
      <p>Local server port:{process.env.REACT_APP_LOCAL_SERVER_PORT}</p>
      <Table></Table>
    </div>
  );
}

export default App;
