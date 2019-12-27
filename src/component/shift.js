import React from "react";
import TableCreator from "./tablecreator";
import DB from "../db";
import "../css/tailwind.css";

class ShiftComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleListIndex = this.handleListIndex.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateShift = this.updateShift.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }
  state = {
    db: new DB("http://71.77.100.67:5984/gppbase"),
    meg: {
      staff: [
        {
          ac_no_: 8,
          name: "SALAKO JOSEPH",
          time: "06-Jul-19 9:08 AM",
          state: "C/In",
          new_state: null
        },
        {
          ac_no_: 10,
          name: "AWOSANYA GBENGA",
          time: "06-Jul-19 8:59 AM",
          state: "C/In",
          new_state: null
        }
      ]
    },
    shiftStaff: [],
    listFlag: [],
    selectValue: "Afternoon",
    filterFlag: ""
  };

  handleFilter(e) {
    let made = e.target.value.toUpperCase();
    this.setState({
      filterFlag: made
    });
   
  }
  handleChange(e) {
    this.setState({ selectValue: e.target.value });
  }
  handleListIndex(index) {
    let agregator;
    let listindic = this.state.listFlag;

    let selectedStaff = this.state.shiftStaff;

    if (selectedStaff.includes(index)) {
      let loc = selectedStaff.indexOf(index);
      selectedStaff.splice(loc, 1);
      
      this.setState({ shiftStaff: selectedStaff });
    } else {
      
      agregator = selectedStaff.concat(index);
      
      this.setState({ shiftStaff: agregator });
    }

  
  }

  async updateShift() {
    let data = await this.state.db.getallGppDocs("gppstaff");
    let selectedStaff=this.state.shiftStaff;
    data.staff.map(info => {
      if (selectedStaff.includes(info["acc_id"])) {
        info.shift = this.state.selectValue;
      }
    });

    await this.state.db.UpdateallGppDocs(data);
    await this.setState((state)=>state.meg= data);
    await this.setState( (state)=>state.shiftStaff=[]);
    selectedStaff=this.state.shiftStaff
    
  }
  tableListsFlag() {
       
  }

 
  async componentDidMount() {
    const meg = await this.state.db.getallGppDocs("gppstaff");
   
    this.setState({
      meg
    });
    console.log(meg)
    this.tableListsFlag();
  }

  render() {
    return (
      <div className="container mx-auto ">
        <div className="text-center mb-10">
          <h1 className="text-center text-4xl font-bold p-10">
            Shift Management
          </h1>
          <select
            className="mr-20  border border-gray-200 text-gray-700 py-2 px-2 pr-8 w-48 text-center"
            onChange={this.handleFilter}
          >
            <option value="">Filter by Department</option>
            <option value="">All Department</option>
            <option value="production">Production</option>
            <option value="Polar">Polar</option>
            <option value="ST Master">ST Master</option>
            <option value="SM74">SM74</option>
            <option value="BINDING">Binding</option>
            <option value="CITYLINE">Cityline</option>
            <option value="PREPRESS">Prepress</option>
            <option value="Folding">Folding</option>
            <option value="laminating">Laminating</option>
            <option value="cd102">CD102</option>
            <option value="engineering">Engineering</option>
            <option value="admin">Admin</option>
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
            <option value="ministry">Ministry</option>
            <option value="auditor">Auditor</option>
            <option value="store">Store</option>
            <option value="ofed">OFED</option>
            <option value="client-service">Client-Service</option>
            <option value="ict">ICT</option>
            <option value="Quartz-Driver">Quartz-Driver</option>
            <option value="Quartz-Production">Quartz-Production</option>
            <option value="Planning">Planning</option>
            <option value="Forklift Driver">Forklift Driver</option>
          </select>

          <select
            className="mr-20  border border-gray-200 text-gray-700 py-2 px-2 pr-8 w-48 text-center"
            onChange={this.handleChange}
          >
            <option value="Afternoon">Afternoon</option>
            <option defaultValue value="Morning">
              Morning
            </option>
            <option value="Night">Night</option>
            <option value="Leave">Leave</option>
          </select>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={this.updateShift}
          >
            Update
          </button>
        </div>
        <div className="container mx-auto px-4">
          <TableCreator
            header={["STAFF NO", "NAME", "DEPARTMENT", "SHIFT"]}
            body={this.state.meg["staff"]}
            shiftStaff={this.state.shiftStaff}
            onlistClick={this.handleListIndex}
            filterFlag={this.state.filterFlag}
          ></TableCreator>
          
        </div>
      </div>
    );
  }
}

export default ShiftComponent;
