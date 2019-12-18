import React from "react";
import "../css/tailwind.css";

class TableCreator extends React.Component {
  constructor(props) {
    super(props);
    props = {
      header: [],
      body: [],
      shiftStaff:[],
      listFlag: [],filterFlag:''
    };
    this.state = { colorCode: 1 };

  }
  clicked = {
    backgroundColor: "#9AE6B4"
  };
  unclicked = {
    backgroundColor: "white"
  };
  styling;
  handleListClick(index) {
    this.setState({ colorCode: index });
    this.props.onlistClick(index);
  }
  isFiltered= (staff )=>{ if (this.props.filterFlag){
    
    return staff.title === this.props.filterFlag}
    
    else{return true}
  
  };
  componentDidMount() {}

  render() {
    return (
      <table className="mx-auto px-4 table-fixed text-left">
        <thead>
          <tr>
            {this.props.header.map((head, index) => (
              <th key={index.toString()} class="w-1/4 px-4 py-2">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
    
          {
          this.props.body.filter(this.isFiltered).map((mainer, index) => {

            let styling = this.props.shiftStaff.includes(mainer.acc_id)? this.clicked: this.unclicked;

            return (
              <tr
                key={index.toString()}
                onClick={this.handleListClick.bind(this,mainer.acc_id)}
                style={styling}
              >
                <td class="border px-4 py-2 ">{mainer.acc_id}</td>
                <td class="border px-4 py-2">{mainer.name}</td>
                <td class="border px-4 py-2">{mainer.title}</td>
                <td class="border px-4 py-2">{mainer.shift}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default TableCreator;
