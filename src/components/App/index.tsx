import React from "react";
import Header from "../Header";
import Main from "../Main";
import Table from "../Table";
import Footer from "../Footer";
import "./style.scss";

const App = () => {
  return (
    <div className="App">
      <Header />
      <Main />
      <Table />
      <Footer />
    </div>
  );
};

export default App;
