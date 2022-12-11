import map from "./Map.png";
import "./App.css";
import { useState } from "react";
import data from "./current.json";
// Import Parse minified version
import Parse from 'parse/dist/parse.min.js';

// Your Parse initialization configuration goes here
const PARSE_APPLICATION_ID = 'bh1okCs4GJ0lCsNpiQ42qZuPjEMORHkV28d169Z2';
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = 'A5vXw7wSZ0Pxl08NxJeACTKD8LoLQsvIcbIcfzRQ';
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

const getLocation = (place) => {
  const items = data.filter((y) => y.location.includes(place));

  return {
    place,
    today: items.filter((x) => isToday(x.time)).length > 0,
    element: (
      <div>
        {items.map((item) => (
          <div
            style={{
              backgroundColor: isToday(item.time) ? "greenyellow" : "white",
            }}
          >
            <b
              style={{
                backgroundColor: isToday(item.time) ? "greenyellow" : "white",
              }}
            >
              {item.location}
            </b>
            <p>{item.info}</p>
            <p>{item.time}</p>
          </div>
        ))}
      </div>
    ),
  };
};

const isToday = (time) => {
  const today = new Date().toISOString().substring(0, 10);
  return time.includes(today);
};
const ersboda = getLocation("Ersboda");
const stadsliden = getLocation("Stadsliden");
const angarna = getLocation("Mariehems");
const i20 = getLocation("I 20");
const nydala = getLocation("Nydala");
const gimonas = getLocation("Gimon");

function App() {
  const [selectedPlace, setPlace] = useState(stadsliden);

  return (
    <div className="App" style={{ display: "flex" }}>
      <div style={{ position: "relative" }}>
        <img src={map} alt="map" />
        <div
          style={{
            position: "absolute",
            right: "00px",
            top: "0px",
            borderColor: "red",
            borderLeftWidth: "3px",
            borderStyle: "solid",
            backgroundColor: "white",
            height: "100%",
            width: "150px",
          }}
        >
          <p
            style={{
              position: "absolute",
              left: "5px",
              top: "100px",
              padding: "2px",
              backgroundColor: ersboda.today ? "lightgreen" : "wheat",
              cursor: "pointer",
            }}
            onClick={() => setPlace(ersboda)}
          >
            Ersboda
          </p>
          <p
            style={{
              position: "absolute",
              left: "5px",
              top: "260px",
              padding: "2px",
              backgroundColor: angarna.today ? "lightgreen" : "wheat",
              cursor: "pointer",
            }}
            onClick={() => setPlace(angarna)}
          >
            Mariehemsängarna
          </p>
          <p
            style={{
              position: "absolute",
              left: "5px",
              top: "400px",
              padding: "2px",

              backgroundColor: nydala.today ? "lightgreen" : "wheat",
              cursor: "pointer",
            }}
            onClick={() => setPlace(nydala)}
          >
            Nydala
          </p>
          <p
            style={{
              position: "absolute",
              left: "5px",
              top: "480px",
              padding: "2px",

              backgroundColor: stadsliden.today ? "lightgreen" : "wheat",
              cursor: "pointer",
            }}
            onClick={() => setPlace(stadsliden)}
          >
            Stadsliden
          </p>
          <p
            style={{
              position: "absolute",
              left: "5px",
              top: "590px",
              padding: "2px",

              backgroundColor: i20.today ? "lightgreen" : "wheat",
              cursor: "pointer",
            }}
            onClick={() => setPlace(i20)}
          >
            I20
          </p>
          <p
            style={{
              position: "absolute",
              left: "5px",
              top: "750px",
              padding: "2px",

              backgroundColor: gimonas.today ? "lightgreen" : "wheat",
              cursor: "pointer",
            }}
            onClick={() => setPlace(gimonas)}
          >
            Gimonäs
          </p>
        </div>
      </div>
      <div
        style={{
          width: "500px",
          borderColor: "black",
          borderWidth: "2px",
          borderStyle: "solid",
        }}
      >
        {selectedPlace && selectedPlace.element}
      </div>
    </div>
  );
}

export default App;
