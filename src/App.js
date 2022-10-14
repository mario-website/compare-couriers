import React, {useEffect} from "react";
import logo from "./logo.svg";
import "./App.css";
import Table from "./components/Table";

function App() {
  return (
    <div className="App">
      <Table />
    </div>
  );
}

export default App;

// import {useState} from "react";

// function App() {
//   const [transactions, setTransactions] = useState([
//     {
//       id: 1,
//       date: "2019-12-01",
//       category: "Income",
//       amount: 1000,
//     },
//     {
//       id: 2,
//       date: "2019-12-02",
//       category: "Transportation",
//       amount: -10.55,
//     },
//     {
//       id: 3,
//       date: "2019-12-04",
//       category: "Fashion",
//       amount: -24.99,
//     },
//     {
//       id: 4,
//       date: "2019-12-06",
//       category: "Food",
//       amount: 8.75,
//     },
//     {
//       id: 5,
//       date: "2019-12-06",
//       category: "Housing",
//       amount: -17.59,
//     },
//   ]);

//   function onHeaderClick(e) {
//     const type = e.target.textContent.toLowerCase();
//     console.log(`e.target:`, e);
//     const sortedAtt = e.target.getAttribute("sorted");
//     console.log(`e.target.getAttribute("sorted"):`, e.target.getAttribute("sorted"));
//     e.target.setAttribute("sorted", sortedAtt === "true" ? "false" : "true");
//     // console.log(`sortedAtt:`, sortedAtt);
//     console.log(`e.target.getAttribute("sorted"):`, e.target.getAttribute("sorted"));
//     // e.target.attributes["sorted"] = !sortedAtt;
//     const sorted = [...transactions].sort((a, b) => {
//       if (sortedAtt === "true") return a[type] < b[type] ? 1 : b[type] < a[type] ? -1 : 0;
//       return a[type] > b[type] ? 1 : b[type] > a[type] ? -1 : 0;
//     });
//     //   if (sortedAtt) {
//     // } else {
//     //   e.currentTarget.setAttribute("sorted", true);
//     //   }
//     setTransactions(sorted);
//   }

//   return (
//     <table>
//       <tbody>
//         <tr>
//           <th>
//             <h3 sorted={"true"} onClick={onHeaderClick}>
//               Date
//             </h3>
//           </th>
//           <th>
//             <h3 onClick={onHeaderClick}>Category</h3>
//           </th>
//           <th>
//             <h3 onClick={onHeaderClick}>Amount</h3>
//           </th>
//         </tr>
//         {transactions.map((transaction) => {
//           return (
//             <tr key={transaction.id}>
//               <td>{transaction.date}</td>
//               <td>{transaction.category}</td>
//               <td>{transaction.amount}</td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// }

// export default App;
