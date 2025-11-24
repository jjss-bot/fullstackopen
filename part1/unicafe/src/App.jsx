import { useState } from "react";

function Button({name, onButtonClick}) {
  return (
    <button onClick={onButtonClick}>{name}</button>
  );
}

function Feedback({ records, onFeedback }) {
  const opts = records.map((record, i)=> {
    return (
      <Button key={i} name={record.name} onButtonClick={()=>onFeedback(i)} />
    );
  });

  return(
    <div>
      <h1>give feedback</h1>
      {opts}
    </div>
  );
}

function StatisticLine({text, value}) {
  return (
    <>
      <td>{text}</td>
      <td>{value}</td>
    </>
  );
}

function Statistics({records}) {
  // Calculate the total collected feedback, score and positiveScore
  let score = 0;
  let total = 0;
  let positiveScore = 0;
  for (let record of records) {
    total += record.count;
    score += record.count * record.value;
    positiveScore += (record.value > 0) ? record.count : 0;
  }

  let avg = (score / total) || 0;
  let percentage = ((positiveScore / total) || 0) * 100;

  const stats = records.map((record, i)=> {
    return (
      <tr key={i}>
        <StatisticLine text={record.name} value={record.count}/>
      </tr>
    );  
  });

  if (total > 0) {
    return(
      <div>
        <h1>Statistics</h1>
        <table>
          <tbody>
            {stats}
            <tr>
              <td>all</td>
              <td>{total}</td>
            </tr>
            <tr>
              <td>average</td>
              <td>{avg.toFixed(1)}</td>
            </tr>
            <tr>
              <td>positive</td>
              <td>{percentage.toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Statistics</h1>
        <div>No feedback given</div>
      </div>
      
    );
  }
}


function App() {
  const [fbRecords, setFbRecords] = useState([
    { name: "good", count: 0 , value: 1},
    { name: "neutral", count: 0, value: 0},
    { name: "bad", count: 0, value: -1} 
  ]);

  function handleFeedback(index) {
    const newRecords = [...fbRecords];
    newRecords[index].count += 1;
    setFbRecords(newRecords);
  }

  return (
    <div>
      <Feedback records={fbRecords} onFeedback={handleFeedback}/>
      <Statistics records={fbRecords}/>
    </div>
  );
}


export default App;