import React from 'react'


class AllAttendance extends React.Component{
constructor(props){
    super(props);

    this.props={
header:[],
body:[],

    }

}



render(){
let colum=this.props.header.length-1

return(


    <div>

<table className="text-center w-full">
          <thead className="bg-blue-700 flex text-white w-full">
            <tr className="flex w-full ">
                {
                    this.props.header.map((head,index)=>(
                        <th className={`p-4 w-1/${colum}`}>{head}</th>
                    ))
                }
              
            </tr>
          </thead>

          <tbody
            className="bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full"
            style={{ height: "60vh" }}
          >
            {this.props.body.map((date, index) => {
                let early=date['doc']['staff'].filter(person=> person.status=='Early').length;
                let late=date['doc']['staff'].filter(person=> person.status=='Late').length;
                let absent=date['doc']['staff'].filter(person=> person.status=='Absent').length;
                let leave=date['doc']['staff'].filter(person=> person.shift=='Leave').length;
                let presentTotal=early+late;
                let total=presentTotal+absent;
              return (
                  
                <tr className="flex w-full mb-4">
                  <td className={`p-4 w-1/${colum}`}>{date['doc']['_id']}</td>
                  <td className={`p-4 w-1/${colum}`}>{early}</td>
                  <td className={`p-4 w-1/${colum}`}>{late}</td>
                  <td className={`p-4 w-1/${colum}`}>{absent}</td>
                  <td className={`p-4 w-1/${colum}`}>{leave}</td>
                  <td className={`p-4 w-1/${colum}`}>{total}</td>
                  <td className={`p-4 w-1/${colum}`}>{Number.parseFloat((early/presentTotal)*100).toFixed(2)}</td>
                  

                </tr>
              );
            })}
          </tbody>
        </table>

    </div>
)

}


}


export default AllAttendance;