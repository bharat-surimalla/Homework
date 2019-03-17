import React, { Component, Fragment } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import { FaTrash } from 'react-icons/fa';


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

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    
     if (!this.state.intervalIsSet) {
       let interval = setInterval(this.getDataFromDb, 1000);
        this.setState({ intervalIsSet: interval });
     }
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    this.getDataFromDb();
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // our first get method that uses our backend api to 
  // fetch data from our data base
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


  // our delete method that uses our backend api 
  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: idTodelete
      }
      
    });
  };


  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
        
        <div class="container" >
        <h1 class="text-center"> My Application</h1>
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

            
      <div >
       <ol >  
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
                <li style={{ padding: "10px" }} id={dat._id}>
                  <span style={{ color: "gray" }}> Title: </span> {dat.title} <br />
                  <span style={{ color: "gray" }}> Description: </span>
                  {dat.description}
                
                  <span style={{ margin : "0px 0px 0px 10px" }} class="btn btn-danger" 
                  onClick={() => this.deleteFromDB(dat._id)}>
                  <FaTrash />
          </span>
               
                </li>
              ))}
        </ol>
      </div>    
    </div>
        
        
    );
  }
}

export default App;