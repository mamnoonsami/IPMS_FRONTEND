import React from 'react'
import {useParams} from 'react-router'
import axios from 'axios'
import {useState, useEffect} from 'react'
import { Link } from "react-router-dom";

function AllPests() {

    const cropID = useParams().cropID;

    const [pest, setPest] = useState([]);
    const[cropName, setCropName] = useState([]);

    useEffect(()=>{
        const fetchPests = async () =>{
            try{
               const res =  await axios.get(`https://localhost:44361/api/crops/getspecific/${cropID}`);
               setCropName(res.data[0].cropName);
               setPest(res.data[0].pestDetails);
               console.log(res.data[0].pestDetails);
                
            }catch(err){
                console.log(err);
            }

            
            
        }

        
        fetchPests();

    },[])




    return (
        <div className="outer">
        <h2> Select the Pest for {cropName}</h2>

        <div className="cards">
            
        {pest.map(p => (
                <Link to={`/Pest/Description/${p.pId}`}>
                    <div className="card">
                        <p className="description">{p.pName}</p>
                        <div className="cropImg">
                            <img src={p.pUrl} alt="Loading Images"></img>
                        </div>
                    </div>
                </Link>
        )
        )}
        </div>
    </div>
    )
}

export default AllPests
