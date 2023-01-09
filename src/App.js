import React from "react";
import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import ToolBar from "./components/Toolbar";
import "./styles/app.scss"
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

function App() {

  const routes = {
    path: '/'
  }
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/:id" element={<><ToolBar/><SettingBar/><Canvas/></> }/>
            {/* <ToolBar/>
            <SettingBar/>
            <Canvas/> */}
           <Route path="*" element={<Navigate to={`f${(+new Date).toString(16)}`} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
