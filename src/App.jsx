import React from "react";
import AsyncComponent from "./AsyncComponent";
import HeavyComponent from "./HeavyComponent";

const App = () => {
  return (
    <div>
      <AsyncComponent />
      <hr />
      <HeavyComponent />
    </div>
  );
};

export default App;
