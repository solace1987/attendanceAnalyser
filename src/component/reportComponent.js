import React from "react";
import "../css/tailwind.css";
import Calendar from "react-calendar";
import DB from "../db";

let formatDate = input => {
  let date = new Date(input);

  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
};
function Selector(props) {
  return (
    <>
      {props.label.map((label, index) => {
        return <option value={props.value[index]}>{label}</option>;
      })}
    </>
  );
}

class ReportComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      db: new DB("http://127.0.0.1:5984/gppattedance"),
      allRecord: {},
      onCalender: false,
      dateVal: "",
      startKey: "",
      endKey: "",
      isQueried: false,
      statusVal: "none",
      deptVal: "none",
      nameVal: "",
      filteredRec:[],
    };
    this.onQuery = this.onQuery.bind(this);
    this.onvalueChange=this.onvalueChange.bind(this);
  }

  async onQuery() {
    let allAtt = await this.state.db.getGppattendRange(
      this.state.startKey,
      this.state.endKey
    );
    
    await this.setState({ allRecord: allAtt });
    function filterSwitch(property, value) {
      if (value === "none" || property == value || value == ""||value=='NONE') {
        return true;
      } else {
        return false;
      }
    }

   let keg = []
    let baff=this.state.allRecord
   
    baff.rows.map(obj => {
      obj.doc.staff.forEach(person => {
        keg.push(person);
      });
    });
    
   let deg = keg.filter(person => {
 
      return (
        
        filterSwitch(person["name"], this.state.nameVal) &&
        filterSwitch(person["title"], this.state.deptVal.toUpperCase()) &&
        filterSwitch(person["status"], this.state.statusVal)
      );
    });
  await this.setState({filteredRec:deg})
  console.log(deg)
   keg=[];
  
  }


  async onvalueChange(evt){

        if(evt.target.name==='dept'){
      await this.setState({deptVal:evt.target.value})

    }
    else if(evt.target.name==='status'){
      await this.setState({statusVal:evt.target.value})
      
    }
    else if(evt.target.name==='staff'){

      await this.setState({nameVal:evt.target.value})

      
    }
    else if(evt.target.name==='startKey'){
      await this.setState({startKey:evt.target.value})
      

    }
    else if(evt.target.name==='endKey'){
    await this.setState({endKey:evt.target.value})
    
    }
  }
  render() {
    return (
      <div>
        <div className="flex justify-center m-10">
          <h2 className="mt-2 mr-2 font-semibold">NAME:</h2>
          <input
            className="mr-10  	rounded-sm border border-gray-200 text-gray-700 py-2 px-2 pr-8 w-50 text-center hover:border-blue-500"
            name="staff" onChange={this.onvalueChange}
          />
          <h2 className="mt-2 mr-2 font-semibold">DEPT:</h2>
          <select
            className="mr-10  rounded-sm border border-gray-200 text-gray-700 py-2 px-2 pr-8 w-48 text-center hover:border-blue-500"
            name="dept" onChange={this.onvalueChange}
          >
            <Selector
              label={[
                "None",
                "Production",
                "Polar",
                "ST Master",
                "SM74",
                "Binding",
                "Cityline",
                "Prepress",
                "Folding",
                "Laminating",
                "CD102",
                "Engineering",
                "Admin",
                "Sales",
                "HR",
                "Finance",
                "Ministry",
                "Auditor",
                "Store",
                "OFED",
                "Client-Service",
                "ICT",
                "Quartz-Driver",
                "Quartz-Production",
                "Planning",
                "Forklift Driver"
              ]}
              value={[
                "none",
                "Production",
                "Polar",
                "ST Master",
                "SM74",
                "Binding",
                "Cityline",
                "Prepress",
                "Folding",
                "Laminating",
                "CD102",
                "Engineering",
                "Admin",
                "Sales",
                "HR",
                "Finance",
                "Ministry",
                "Auditor",
                "Store",
                "OFED",
                "Client-Service",
                "ICT",
                "Quartz-Driver",
                "Quartz-Production",
                "Planning",
                "Forklift Driver"
              ]}
            ></Selector>
          </select>

          <h2 className="mt-2 mr-2 font-semibold">STATUS:</h2>
          <select
            className="mr-10  border border-gray-200 text-gray-700 py-2 px-2 pr-8 w-48 text-center hover:border-blue-500"
            name="status" onChange={this.onvalueChange}
          >
            <Selector
              label={["None", "Late", "Early", "Absent", "Leave"]}
              value={['none', "Late", "Early", "Absent", "Leave"]}
            ></Selector>
          </select>
        </div>
        <div className="flex justify-center">
          <div className="">
            <h4 className="mt-2 mr-2 font-semibold">Start Date</h4>
            <input
              type="text"
              name="startKey"
              onChange={this.onvalueChange}
              placeholder="DD/MM/YYY"
              className="mr-10  	rounded-sm border border-gray-200 text-gray-700 py-2 px-2 pr-8 w-50 text-center hover:border-blue-500"
            />
          </div>
          <div>
            <h4 className="mt-2 mr-2 font-semibold">End Date</h4>
            <input
              type="text"
              name="endKey"
              onChange={this.onvalueChange}
              placeholder="DD/MM/YYY"
              className="mr-10 rounded-sm border border-gray-200 text-gray-700 py-2 px-2 pr-8 w-50 text-center hover:border-blue-500"
            />
          </div>
          <button
            className="  bg-red-600 text-white font-bold py-2 px-8 mx-8 rounded opacity-30 my-8 active:bg-red-800"
            onClick={this.onQuery}
          >
            Query
          </button>
        </div>
      </div>
    );
  }
}

export default ReportComponent;
