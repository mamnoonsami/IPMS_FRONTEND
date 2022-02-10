import React, {useEffect, useState} from 'react'
import { Link } from "react-router-dom";
import './home.css'
import axios from 'axios';
import Searchbar from '../SearchBar/Searchbar';
import Footer from '../Footer/Footer';


function Home() {
    const [data, setData] = useState([]);
    const [pressed, setPressed] = useState(false);
    
    const handleSubmit = async(e) => {

        e.preventDefault();
       //console.log(data);
    }

    useEffect(()=>{
        const fetchCrops = async () =>{
            try{
                const res = await axios.get("https://localhost:44361/api/crops/getall");
                console.log(res.data);
                setData(res.data);
            }catch(err){
                console.log(err);
            }
        }

        fetchCrops();
    }, [])

    return (
        <div>
            <Searchbar placeholder='e.g. Corn' data={data}/>
            <div className="container">
                <Link to="/Crops">
                    <div className="insects con-item">
                        <h4>Insects</h4>
                    </div>
                </Link>

                <Link to = "/diseases">
                    <div className="diseases con-item">
                        <h4>Diseases</h4>
                    </div>
                </Link>

                <Link to="weeds"> 
                    <div className="weeds con-item">
                        <h4>Weeds</h4>
                    </div>
                </Link>
            </div>

            {/* {searchResult? 
            <div className='outer'>
                <h3>Search Result</h3>
                
                <div className='cards'>
                    {searchResult.map(c=> (
                        <Link to={`/Crops/${c.id}`}>
                            <div className="card">
                                <p className="description">{c.crop}</p>
                                <div className="cropImg">
                                    <img src={c.image} alt="Loading Images"></img>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div> : null} */}
            <Footer/>
        </div>
    )
}

export default Home
