import React, {useState} from 'react';
import { Link } from "react-router-dom";
import SearchIcon from './search.svg';
import CloseIcon from './close.svg';
import "./Searchbar.css";

function Searchbar({placeholder, data}) {
    const iconStyle = {
        color: "rgb(101, 60, 168)", 
    }

    const [wordEntered, setWordEntered] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const handleChange = (e) => {
       const searchKeyword =  e.target.value;
       setWordEntered(searchKeyword);
        const newFilter = data.filter((value)=> {
            return  value.crop.toLowerCase().startsWith(searchKeyword.toLowerCase());
        });

        if(searchKeyword === "") {
            setFilteredData([]);
        }
        else{
            setFilteredData(newFilter);
        }
    }

    const clearInput = () => {
         //setSearchKeyword("");
        setFilteredData([]);
        setWordEntered("");
    }
    return (
        <div className='search'>
           <div className="searchInputs">
                <input id="searchBox" value={wordEntered} onChange={handleChange} placeholder={placeholder}></input>
                <div className="searchIcon">
                    {filteredData.length === 0? (<img src={SearchIcon} alt="wait" />) : 
                    (<img src={CloseIcon} alt="wait" id='clearBtn' onClick={clearInput}/>) }
                </div>
                
           </div>
           {
               filteredData.length != 0 && 
                <div className="dataResult">
                        {
                            filteredData.slice(0,15).map((value, key)=> {
                                return <Link to={`/Crops/${value.id}`} className='dataItem'> <div id="sResult"> <img src={value.image} alt="wait" /> <p>{value.crop} </p></div></Link>
                            })
                        }
                </div>
            }
        </div>
    )
}

export default Searchbar
