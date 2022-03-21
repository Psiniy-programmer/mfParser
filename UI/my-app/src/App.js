import './App.css';
import {useEffect, useState} from "react";
import {Directions} from "./components/Directions";
import {Points} from "./components/Points";

const baseUrl = `http://localhost:${3042}`;

export const apiUrls = {
  direction: '/direction',
  directionWithId: '/direction/:id',
  points: '/points',
}


function App() {
  const [directionsData, setDirectionsData] = useState([]);
  const [pointsData, setPointsData] = useState([]);

  useEffect(() => {
    fetch(`${baseUrl}${apiUrls.direction}`)
      .then((res) => res.json())
      .catch((err) => console.error(err))
      .then((okData) => setDirectionsData(okData));

    fetch(`${baseUrl}${apiUrls.points}`)
      .then((res) => res.json())
      .catch((err) => console.error(err))
      .then((okData) => setPointsData(okData));
  }, [])

  console.log('direction', directionsData);

  return (
    <div className="App">
      <h2>Directions table</h2>
      {
        directionsData?.length && (
          <Directions directionsData={directionsData}/>
        )
      }
      <h2>Points table</h2>
      {
        pointsData.length && (
          <Points pointsData={pointsData}/>
        )
      }
    </div>
  );
}

export default App;
