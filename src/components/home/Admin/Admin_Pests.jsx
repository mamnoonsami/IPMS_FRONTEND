import React from 'react'
import {useState, useEffect} from 'react';
import axios from 'axios'
import "./Admin_Crops.css";
import DeleteIcon from './delete.svg';
import {toast} from 'react-toastify';
import Crops from '../Crops';
import { useLocation, useParams } from 'react-router-dom';
toast.configure()

const initialImageValues = {
    imageName: '',
    imageSrc : '',
    imageFile : null
}
function Admin_Pests(props) {
    const [userAuth, SetUserAuth] = useState(props.user[0].uAuthLevel);
    //const location = useLocation(); // for getting the parameter through <Link>
    //const {cropId} = location.state;
    const cropId = useParams().cropID;
    const [pest, setPest] = useState([]);
    const[loading,setLoading] = useState(true);
    const [pestName, setPestName] = useState("");
    const [pestDesc, setPestDesc] = useState("");
    const[imgValues,setImgValues] = useState(initialImageValues);

    useEffect(()=>{
        
        fetchPests();
        if(loading){
            fetchPests();
        }
        
    }, [loading,pest])

    const fetchPests = async () =>{
        try{
            const res = await axios.get("https://localhost:44361/api/crops/getall")
            .then(res => {
                setPest(res.data);
                setLoading(false);
            })
        }catch(err){
            console.log(err);
        }
    }

    const editPests = (e)=>{

        e.preventDefault();
        const formData = new FormData();
        formData.append('CName', pestName);
        formData.append('CDescription', pestDesc);
        formData.append('CImageName', imgValues.imageName);
        formData.append('CImageFile', imgValues.imageFile);
        if(pestName && pestDesc && imgValues.imageFile){
            exampleAPI('https://localhost:44361/api/crops/create').create(formData)
            .then(res=> {
                console.log(res.data);
                
                if(res.status === 200 && res.data.message != "Conflict"){
                    setPestName("");
                    setPestDesc("");
                    document.getElementById('imageUploader').value = null; //THE CHOSEN IMAGE FILE NAME GET CLEARED AFTER COMMENT HAS BEEN POSTED
                    toast.success(res.data.message,{ //THE SUCCESS NOTIFICATION
                        position: toast.POSITION.TOP_RIGHT,
                        hideProgressBar: false,
                        autoClose: 2000,

                    });
                }
                else if(res.status === 200 && res.data.message === "Conflict") //409 status code. That means Conflict : already exist some data 
                {
                    toast.error("Duplicate crop name found",{ //THE SUCCESS NOTIFICATION
                        position: toast.POSITION.TOP_RIGHT,
                        hideProgressBar: false,
                        autoClose: 2000,
        
                    });
                }
                
            })
            .catch(err=> console.log(err))
        }

        else{
            toast.error('Atleast one field is missing',{ //THE SUCCESS NOTIFICATION
                position: toast.POSITION.TOP_RIGHT,
                hideProgressBar: false,
                autoClose: 2000,

            });
        }

    }
    const removePest = (e,cropId)=> {
        
        e.preventDefault();
        console.log(props);
        axios.delete(`https://localhost:44361/api/crops/DeleteCrop/${cropId}`)
        .then(res=>{
            toast.success('record has been deleted',{ //THE SUCCESS NOTIFICATION
                position: toast.POSITION.TOP_RIGHT,
                hideProgressBar: false,
                autoClose: 2000,

            });
        })
        
    }

    const exampleAPI = (url) => {
        return {
            create : newRecord => axios.post(url,newRecord),
            delete: id => axios.delete(url)
        }
    }
    const showPreview = e =>{
        if(e.target.files && e.target.files[0]){
            let imageFile = e.target.files[0];
            //console.log(imageFile);
            const reader = new FileReader();
            reader.onload = x =>{
                setImgValues({
                    ...imgValues,
                    imageFile,
                    imageSrc: x.target.result
                })
               // console.log(x.target.result);
            }
            reader.readAsDataURL(imageFile);
        }

        else{
            setImgValues({
                ...imgValues,
                imageFile:null,
                imageSrc: ""
            })
        }
    }

  return (
    <div className='adminMainDiv'>
       {userAuth==="Admin" && <div className="addingForm">
            <form className="pestsForm" autoComplete='off' onSubmit={editPests}>
                <div className="form-groups">
                    <input name="pestName" type="text" placeholder="Pest name" required
                    onChange={e => setPestName(e.target.value)}
                    value={pestName}
                    />
                </div>
                <div className="form-groups">
                    <input className="adminPestDesc" name="cropDesc" type="text" placeholder="Short description" required
                    onChange={e => setPestDesc(e.target.value)}
                    value={pestDesc}
                    />
                </div>
                <div className="imageUploadDiv form-groups">
                        <input required type="file" accept='image/*' className='imageFile' onChange={showPreview} id="imageUploader"/>
                </div>
                                
                <button className='adminSave'>Save</button>
                <h1>{cropId}</h1>
            </form>
        </div>}
        {userAuth==="Admin" && <div className="existingData">
            <div className="adminHeading">
                <h3>Pests</h3>
                <h5>({pest.length} items)</h5>
            </div>
            <div className="cropsList">
                {pest.map(p=>(
                    <div className="cropItself" key={p.id}>
                        <p>{p.crop}</p>
                        <img className="adminRemoveIcon" src={DeleteIcon} alt="remove" onClick={e=> removePest(e,p.id)}/>
                    </div>
                ))
                }
            </div>
        </div>}
    </div>
  )
}

export default Admin_Pests