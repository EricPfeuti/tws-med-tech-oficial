import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  
  const [array, setArray] = useState([]);

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.users);
    console.log(response.data.users);
  };

  useEffect(() => {
    fetchAPI();
  },[]);

  return (
    <div>
      {
        array.map((user, index) => (
          <div key={index}>
            <p>{user}</p>
            <br></br>
          </div>
        ))
      }
    </div>
  );
}

export default App;
