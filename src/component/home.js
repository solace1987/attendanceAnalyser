import React from "react";
import ShiftComponent from './shift'
import  CsvAnalysis from './csvFileAnalysis'
import { Route } from "react-router-dom";
import Header from "./header";
import "../css/tailwind.css";
import ReportComponent from "./reportComponent";

class Home extends React.Component {
  
   
  render() {
    return (

      <div>
        <Header/>
      <Route path='/analyser' component={CsvAnalysis}/>
      <Route path='/shift' component={ShiftComponent}/>
      <Route path='/report' component={ReportComponent}/>

  
      </div>
    
    );
  }
}

export default Home;
