import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import axios from "axios";

function App() {
  const [icecreamData, setIcecreamData] = useState([])
  const [deletedFlavor, setdeletedFlavor] = useState({})
 
  //connect to api
  useEffect(() => {
    const fetchflavors = async () => {
      try {
        //fetch all icecream flavors
        const { data } = await axios.get("http://localhost:3000/api/icecream");

        //update use state with sorted data
        setIcecreamData(
          data.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchflavors();
  }, []);

  //handles delete event
  //input : obj to be deleted
  const deleteFlavor= (icecream)=>{    
    try{
       //call api to delete flavor in db
        const deleteFlavor = async ()=>{          
           const response = await axios.delete(`http://localhost:3000/api/icecream/${icecream.id}`);
          
           //update state removing deleted flavor
           updateIcecreamData(icecream);
        }
        deleteFlavor();
    }catch(error){
      console.log(error);
    }
  }

  //updates flavor list by removing deleted flavor
  function updateIcecreamData(deletedFlavor){
    const updatedFlavors = icecreamData.filter((flavor)=>{
          return flavor.id != deletedFlavor.id;
    });

    setdeletedFlavor(deletedFlavor);
    setIcecreamData(updatedFlavors);
  }

  //form JSX string to display data
  const icecreamList = icecreamData?.map((icecream) => {
    return (
      <div key={icecream.id} className="icecreamDiv">
        <p className='icecreamid'>{icecream.id}</p>
        <p className='icecream'>{icecream.name}</p>
        <div className='deleteDiv'><button onClick={()=>{deleteFlavor(icecream)}} className='deleteButton'>&#10060; </button></div>
      </div>
    );
  });

 


  return (
    <>
      <h1>Icecream Shop [{icecreamData.length}]<sup className="count">Flavors</sup> - Fullstack flow</h1>
      {/* display error message */}
      {icecreamData.length <= 0 ? (
        <p className="errorMessage">There are no icecreams to display.</p>
      ) : (
        ""
      )}
      {/* display message on successful deletion */}
      {deletedFlavor.id>=0?
        <p className='message'>Flavor {deletedFlavor.id} {deletedFlavor.name} deleted.</p> :""
      }
      <div className="Container">
        {/* <p className="message">Favorite pets are highlighted.</p> */}
        <div className="icecreamHeader">
          <p className='id'>Flavor ID</p>
          <p>Flavor Name</p>          
        </div>
        {icecreamList}
      </div>    
     
    </>
  )
}

export default App
