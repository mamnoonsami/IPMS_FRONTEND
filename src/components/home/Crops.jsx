import {useState, useEffect} from 'react'

import { Link } from "react-router-dom";
import axios from 'axios'
import './insects.css'
import Admin_Crops from './Admin/Admin_Crops';
import './Crops.css'

function Crops() {

    const [crop, setCrop] = useState([]);
    const [user, setUser] = useState(null);
    const [add, setAdd] = useState(false);
    const[loading,setLoading] = useState(true); // for populating all the states until its false
    const[loading1,setLoading1] = useState(true);
    useEffect(()=>{
        fetchUser();
        if(loading){
            fetchUser();
        }
        fetchCrops();
        if(loading1){
            fetchCrops();
        }
    }, [loading,loading1])
    //console.log(user);
    const fetchUser = async() => {
        try{
            const res = await fetch('https://localhost:44361/api/users/getuser', {
                headers: {"Content-Type": 'application/json;charset=UTF-8'},
                credentials: 'include',
            });

            const content = await res.json();
            setUser(content[0]);
            //console.log(user);
            if(user && user.uAuthLevel=="Admin") {
                setAdd(true);
                
            }
            setLoading(false);
          }
          catch(e){
            console.log(e);
          }
    }

    const fetchCrops = async () =>{
        try{
            const res = await axios.get("https://localhost:44361/api/crops/getall")
            .then(res => {
                setCrop(res.data);
                setLoading1(false);
            })
            
        }catch(err){
            console.log(err);
        }
    }

    
    return (
        <div className="outer">
            <div className='adminStyle'> 
                <h2> Select the Crop </h2>

                {add && 
                <div className='adminAccess'> 
                <Link to="/AdminCrops">
                    <button className="editSave edit">Edit</button>
                </Link>
                </div>}
            </div>
            
            <div className="cards">
                
            {crop.map(cr => (
                <Link to={`/Crops/${cr.id}`} key={cr.id}>
                            <div className="card">
                                <p className="description">{cr.crop}</p>
                                <div className="cropImg">
                                    <img src={cr.image} alt="Loading Images"></img>
                                </div>
                            </div>
                    </Link>
            )
            )}
            </div>
        </div>
    )

}

export default Crops
