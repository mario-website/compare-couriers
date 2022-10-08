const dynamicSort = (property) => {
  if (property === "price") {
    return function (a, b) {
      return a[property] - b[property];
    };
  }
  if (property === "-price") {
    property = property.substr(1);
    return function (a, b) {
      return b[property] - a[property];
    };
  }
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
  // return function (a, b) {
  //   return sortOrder === -1 ? b[property] - a[property] : a[property] - b[property];
  // };
};

//znalazłem taki validator aby sprawdzić wszystkie mozliwości czy ciąg znaków jest liczbą -
//(tak mówią na stacku przynajmniej :) ):
//https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
const isNumeric = (str) => {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

export {dynamicSort, isNumeric};
