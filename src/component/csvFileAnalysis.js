import React, { Component } from "react";
import XLSX from "xlsx";
import DB from "../db";
import "../css/tailwind.css";
import AllAttendance from "./allAttendance";

class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: new DB("http://71.77.100.67:5984/gppbase"),
      db2: new DB("http://71.77.100.67:5984/gppattedance"),
      file: {},
      dailyData: [],
      shift: [],
      worker: [],
      staff: [],
      allAtt: [],
      date:'',
      inputVal: "18-Oct-19",
      isProcessed: false,
      isSaved: false,
    };
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.parseAttendance = this.parseAttendance.bind(this);
    this.processData = this.processData.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.maxOccur=this.maxOccur.bind(this);
  }
  maxOccur(newa) {
    let key = "";
    let keyArr = [];
    newa.forEach(person => {
      key = person.Date;
      if (!keyArr.includes(key)) {
        keyArr.push(key);
      }
    });

    let occurence = [];

    keyArr.forEach(date => {
     let number = newa.filter(person => person.Date == date).length;
      occurence.push(number);
    });

    let max = occurence.reduce(function(a, b) {
      return Math.max(a, b);
    });

    return keyArr[occurence.indexOf(max)];
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  }

  handleFile() {
    let temp = [];
    var reader = new FileReader();

    reader.onload = function(e) {
      var workbook = XLSX.read(e.target.result, {
        type: "binary"
      });

      //Fetch the name of First Sheet.
      var firstSheet = workbook.SheetNames[0];

      //Read all rows from First Sheet into an JSON array.
      var excelRows = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[firstSheet]
      );

      this.setState({ dailyData: excelRows });
     
      let parseData = this.parseAttendance();
      this.processData(parseData);
    }.bind(this);
    reader.readAsBinaryString(this.state.file);
  }
  
  parseAttendance() {
    let attendance = [];

    function timeFormater(time) {
      var hours = Number(time.match(/^(\d+)/)[1]);
      var minutes = Number(time.match(/:(\d+)/)[1]);
      var AMPM = time.match(/\s(.*)$/)[1];
      if (AMPM == "PM" && hours < 12) hours = hours + 12;
      if (AMPM == "AM" && hours == 12) hours = hours - 12;
      return hours * 60 + minutes;
    }

    let dailyattend = this.state.dailyData;
    let staffs = this.state.worker.staff;
    //let date = this.state.inputVal.toLowerCase();
   

    dailyattend.map(staff => {
      staff.Date = staff["Time"].split(" ")[0].toLowerCase();
      staff.Time = timeFormater(
        `${staff["Time"].split(" ")[1]} ${staff["Time"].split(" ")[2]}`
      );
      return staff;
    });
   let date= this.maxOccur(dailyattend).toLowerCase()
    staffs.forEach(staff => {
      let tempArr = dailyattend.filter(value => {
        return value["Name"] == staff["name"] && value["Date"] == date;
      });

      attendance.push(tempArr);
    });

    return attendance;
  }

  processData(rec) {
    let staffs = this.state.worker.staff;
    let shift = this.state.shift;
    rec.forEach((clockIns, index) => {
      let shiftname = staffs[index].shift;

      if (clockIns.length == 0 && shiftname !== "Leave") {
        staffs[index].status = "Absent";
      }
      
    else if(shiftname == "Leave"){

      staffs[index].status = "Leave";
    }
      else {
        clockIns.forEach(comeIn => {
          if (
            shiftname == "Morning" &&
            comeIn["Time"] < shift[shiftname]["graceTime"]
          ) {
            staffs[index].status = "Early";
          } else if (
            comeIn["Time"] > shift[shiftname]["startTime"] - 240 &&
            comeIn["Time"] < shift[shiftname]["graceTime"]
          ) {
            staffs[index].status = "Early";
          } else if (comeIn["Time"] < shift[shiftname]["graceTime"] + 300) {
            staffs[index].status = "Late";
          }
        });
      }
    });
    this.setState({ isProcessed: true, isSaved: false, staff: staffs });

    
  }
  onDateChange(e) {
    this.setState({ inputVal: e.target.value });
  }

  async onSave() {
    let data = {};
    data.staff = this.state.staff;
    data._id = this.state.inputVal;
    this.state.db2.UpdateAttendance(data);
    let allAtt = await this.state.db2.getGppattend();
    this.setState({ isSaved: true, isProcessed: false, allAtt });
  }
  async componentDidMount() {
    const staff = await this.state.db.getallGppDocs("gppstaff");
    const shift = await this.state.db.getallGppDocs("shift");

   

    this.setState({
      worker: staff,
      shift
    });
  }

  render() {
    let table = "";
    if (this.state.isProcessed && !this.state.isSaved) {
      table = (
        <div>
          <table className="text-center w-full">
            <thead className="bg-blue-700 flex text-white w-full">
              <tr className="flex w-full ">
                <th className="p-4 w-1/5">ACC.NO</th>
                <th className="p-4 w-1/5">NAME</th>
                <th className="p-4 w-1/5">DEPARTMENT</th>
                <th className="p-4 w-1/5">SHIFT</th>
                <th className="p-4 w-1/5">ATTENDANCE STATUS</th>
              </tr>
            </thead>

            <tbody
              className="bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full"
              style={{ height: "60vh" }}
            >
              {this.state.staff.map((person, index) => {
                return (
                  <tr className="flex w-full mb-4">
                    <td className="p-4 w-1/5">{person.acc_id}</td>
                    <td className="p-4 w-1/5">{person.name}</td>
                    <td className="p-4 w-1/5">{person.title}</td>
                    <td className="p-4 w-1/5">{person.shift}</td>
                    <td className="p-4 w-1/5">{person.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            className="  bg-red-600 text-white font-bold py-2 px-8 mx-8 rounded opacity-30 my-8"
            onClick={this.onSave}
          >
            Save
          </button>
        </div>
      );
    } else if (this.state.isSaved && !this.state.isProcessed) {
      table = (
        <div>
          <AllAttendance
            body={this.state.allAtt["rows"]}
            header={[
              "Date",
              "No Early",
              "No Late",
              "No Absent",
              "No Leave",
              "Total Present",
              "% Early"
            ]}
          ></AllAttendance>
        </div>
      );
    }
    return (
      <div>
        <div className="mt-2">
          <div className="flex items-center justify-center bg-grey-lighter">
            <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-700 hover:text-white">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className=" text-base leading-normal">
                Select an Excel file
              </span>
              <input
                type="file"
                className="form-control hidden"
                id="file"
                onChange={this.handleChange}
              />
            </label>
            <div className="mx-10 flex items-center flex-col">
              <h3 className="text-lg font-medium  ">
                Input the correct date of attendance to be processed(
                <span className="text-red-600">Very important</span>)
              </h3>
              <input
                value={this.state.inputVal}
                onChange={this.onDateChange}
                className=" border border-blue p-2 text-center"
              ></input>
              <button
                className="  bg-red-600 text-white font-bold py-2 px-8 mx-8 rounded opacity-30 my-8"
                onClick={this.handleFile}
              >
                Process File
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center"></div>
          <div className="container">
            <h1 className="mb-8"></h1>
            {table}
          </div>
        </div>
      </div>
    );
  }
}

export default ExcelReader;
