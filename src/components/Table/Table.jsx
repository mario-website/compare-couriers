import React, {useState, useReducer} from "react";
import {INITIAL_STATE, postReducer} from "../../store/postReducer";
import {handleFetchNewData, sorting} from "./functions";
import SingleService from "./SingleService/SingleService";

const Table = () => {
  const [data, setData] = useState([]);
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const [allResponses, setAllResponses] = useState([]);
  const [fetchCounter, setFetchCounter] = useState(0);
  const [tempController, setTempController] = useState();
  const {defValIsAscending} = state.defaultValues.isAscending;

  const setNewData = () => {
    handleFetchNewData(
      tempController,
      setTempController,
      setFetchCounter,
      setAllResponses,
      setData,
      state
    );
  };

  const setSorting = (sortBy) => {
    sorting(sortBy, data, defValIsAscending, setData);
  };

  return (
    <div className="Table">
      {state.error !== false && (
        <p>
          error message{state.error.message}, error stack{state.error.stack}
        </p>
      )}
      <p>Server port:{process.env.REACT_APP_LOCAL_SERVER_PORT}</p>
      <button onClick={setNewData}>get data</button>
      <button onClick={() => setSorting("price")}>sortByPrice</button>
      <button onClick={() => setSorting("alphabetical")}>sortByName</button>
      <span>fetchCounter:{fetchCounter}</span>
      <SingleService data={data} />
    </div>
  );
};

export default Table;
