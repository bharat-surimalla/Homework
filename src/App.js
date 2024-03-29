import React, { Component, Fragment } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import { FaTrash } from 'react-icons/fa';
import { MDBDataTable, Collapse } from 'mdbreact';


class App extends Component {
  // initialize our state 

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      id: 0,
      message: null,
      intervalIsSet: false,
      idToDelete: null,
      idToUpdate: null,
      objectToUpdate: null
      
    };
  }
  
  componentDidMount() {
    this.getDataFromDb();
    
     if (!this.state.intervalIsSet) {
       let interval = setInterval(this.getDataFromDb, 1000);
        this.setState({ intervalIsSet: interval });
     }
  }
  componentWillUnmount() {
    this.getDataFromDb();
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => {  this.setState({ data: res.data })});
  };
	
	putDataToDB = (e) => {
		//we don't want the form to submit, so we prevent the default behavior
		e.preventDefault();
		var title = this.state.title.trim();
		var description = this.state.description.trim();
		axios.post("http://localhost:3001/api/putData", {title: title, description: description})
			.then(function(response){console.log("post", response);});	
		this.setState({
		  title: '',
		  description: ''
    }); 
	  };

  deleteFromDB = (e) => {
    const url ="http://localhost:3001/api/deleteData";
    var { idToDelete } = e;
		axios.delete(url, {
      data: { _id: e }
    })
			.then(function(response){console.log("delete", response);});	
		this.setState({
		  idToDelete: '',
    }); 
	  };

  render() {
    const { data } = this.state;
    return (
        
        <div class="container" >
        <h1 class="text-center"> Homework Application</h1>
        <form className="donationForm" onSubmit={this.putDataToDB}>
        <div class="from-group">
          <label for="pwd"> Title </label>
          <input class="form-control"
			  value={this.state.title}
			  uniqueName="title"
			  text="Title"
			  onChange={e => this.setState({ title: e.target.value })} 
			  />
        </div>
        <div class="from-group">
        <label for="pwd">Description:</label>
			<input
        class="form-control"
			  value={this.state.description}
			  uniqueName="description"
			  text="Description"
			  onChange={e => this.setState({ description: e.target.value })} 
			  />
        </div>
        <br></br>
        <div>
        <button type="submit" class="btn btn-primary">Submit</button>
        </div>

      </form>
      <div>
        <span>DataBase Entries:</span>
      </div>
            
      <div >
      
       
          {data.map(dat => (
            <table style ={{width :'100%',border : "1px solid silver" }} >   
                <tr class="row">
                   <th class="col-sm-4" > {dat.title} </th> 
                   <th class="col-sm-4">{dat.description} </th>
                   <th class="btn  col-sm-4">
                   <button class="btn btn-danger" onClick={() => this.deleteFromDB(dat._id)}>Delete<FaTrash /></button>
                   </th> 
                </tr>
            </table>
              ))}
        
        


      </div>    
    </div>    
    );
  }
}

export default App;