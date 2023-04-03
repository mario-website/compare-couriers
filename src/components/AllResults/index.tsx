import React, {useState, useEffect, useReducer} from "react";
import Table from "../Table";
import Filter from "../Filter";
import "./style.scss";

import {INITIAL_STATE, allResReducer} from "./reducer";
import {createNewData, filterData, sorting, delTime} from "./helpers";
import {AllResultsProps, DefaultData} from "./types";
import {defaultValues, getScreenSize, useBoolean, useScreenSize} from "../../utils";

const AllResults = ({
  allResponses,
  fetchCounter,
  isSearching,
  setIsSearching,
  controller,
}: AllResultsProps) => {
  const [state] = useReducer(allResReducer, INITIAL_STATE);
  const {defaultData} = state;
  const defaultOptions = defaultData.options;
  const defValIsAscending = defaultOptions.isAscending;
  const [screenSize] = useScreenSize();
  const [workingData, setWorkingData] = useState<DefaultData>(defaultData);
  const [currentScreenSize, setCurrentScreenSize] = useState<string>(screenSize);
  const [valClickedSoring, setValClickedSoring] = useState<string>("");
  const [currentSortingValues, setCurrentSortingValues] = useState<
    DefaultData["options"]
  >(defaultData.options);
  const isClickedBtn = useBoolean(false);
  const [isSearchingTxt, setIsSearchingTxt] = useState<string>("please wait...");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (isSearching) {
      setIsOpenModal(allResponses.length === 0);
      const displaySearchingTime = 8500;
      const nothingFoundDisplayTime = 1500;
      const maxiumuDisplayTime = displaySearchingTime + nothingFoundDisplayTime;

      const timer1 = setTimeout(() => {
        if (allResponses.length === 0) setIsSearchingTxt("nothing found");
      }, maxiumuDisplayTime - nothingFoundDisplayTime);

      const timer2 = setTimeout(() => {
        setIsSearching(false);
        setIsOpenModal(false);
        setIsSearchingTxt("please wait...");
        //to stop all searchings after maxiumuDisplayTime countdown
        if (allResponses.length === 0) controller.abort();
      }, maxiumuDisplayTime);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isSearching, allResponses.length, setIsSearching, controller]);

  useEffect(() => {
    setCurrentSortingValues(workingData.options);
  }, [setCurrentSortingValues, workingData.options]);

  //this useEffect is working when new data is received from another courier
  useEffect(() => {
    //when from new courier data received...
    if (allResponses.length) {
      const newData = createNewData(allResponses, defaultValues);
      //1.0
      //create dataAllResponses with only allResponses using default values
      const newFilteredData = filterData(newData, defaultOptions);
      const sortedFD = sorting(
        newFilteredData,
        defValIsAscending,
        getScreenSize(window.innerWidth),
        newFilteredData.options.deliveryTimeBtn
      );
      setWorkingData(sortedFD);
      return;
    }

    //when new courier data received and do not contain any data then all is set to default...
    setWorkingData(defaultData);
  }, [allResponses, defValIsAscending, defaultData, defaultOptions]);

  useEffect(() => {
    if (isClickedBtn.value) {
      setWorkingData((prev) => {
        const sortedData = sorting(
          prev,
          defValIsAscending,
          screenSize,
          prev.options.deliveryTimeBtn,
          valClickedSoring
        );
        return sortedData;
      });
      isClickedBtn.setFalse();
    } else {
      if (currentScreenSize !== screenSize) {
        setWorkingData((prev) => {
          const sortedData = sorting(
            prev,
            defValIsAscending,
            screenSize,
            prev.options.deliveryTimeBtn
          );
          return sortedData;
        });
        setCurrentScreenSize(screenSize);
      }
    }
  }, [defValIsAscending, screenSize, valClickedSoring, isClickedBtn, currentScreenSize]);

  const handleDeliveryTime = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    deliveryTimeBtn: string
  ) => {
    event.preventDefault();
    const sortedData = sorting(
      workingData,
      defValIsAscending,
      screenSize,
      deliveryTimeBtn
    );
    setWorkingData(sortedData);
  };

  const setSorting = (item: string) => {
    // e.preventDefault();
    setValClickedSoring(item);

    // dispatch({type: "SET_IS_CLICKED_BTN_TO_TRUE"});
    isClickedBtn.setTrue();
    // dispatch({type: "SET_VALUE_CLICKED_BTN", payload: item});
  };
  return (
    <section className="Results">
      {isOpenModal && (
        <div className="Results-IsSearching">
          <span>
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p>{isSearchingTxt}</p>
          </span>
        </div>
      )}
      {allResponses.length > 0 && (
        <>
          <Filter
            setSorting={setSorting}
            fetchCounter={fetchCounter}
            currentSortingValues={currentSortingValues}
            screenSize={screenSize}
            workingData={workingData}
            handleDeliveryTime={handleDeliveryTime}
            delTime={delTime}
          />
          <Table workingData={workingData} delTime={delTime} />
        </>
      )}
    </section>
  );
};

export default AllResults;
