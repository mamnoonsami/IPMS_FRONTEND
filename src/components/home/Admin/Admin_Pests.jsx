import React from 'react'
import {useState, useEffect} from 'react';
import axios from 'axios'
//import "./Admin_Crops.css";
import "./Admin_pests.css";
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
    const [allPest, setAllPest] = useState([]);
    const [pest, setPest] = useState([]);
    const[loading,setLoading] = useState(true);
    const[loading1,setLoading1] = useState(true);
    const [pestID, setPestID] = useState("");
    const [pestName, setPestName] = useState("");
    const [pestDesc, setPestDesc] = useState("");
    const[imgValues,setImgValues] = useState(initialImageValues);

    useEffect(()=>{
        
        fetchPests();
        if(loading){
            fetchPests();
        }

        fetchAllPests();
        if(loading1) {
            fetchAllPests();
        }
        
    }, [loading,loading1,pest])

    const fetchAllPests = async () =>{
        try{
            const res =  await axios.get("https://localhost:44361/api/pests/getall")
            .then(res=> {
                setAllPest(res.data);
                //console.log(allPest);
                setLoading1(false);
            })
             
         }catch(err){
             console.log(err);
         }
    }

    const fetchPests = async () =>{
        try{
            const res =  await axios.get(`https://localhost:44361/api/crops/getspecific/${cropId}`)
            .then(res=> {
                setPest(res.data[0].pestDetails);
                //console.log(pest);
                setLoading(false);
            })
             
         }catch(err){
             console.log(err);
         }
    }

    const editPests = (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('CId', cropId);
        formData.append('PId', pestID);
        
        if(pestID){
            exampleAPI('https://localhost:44361/api/cropsPests/create').create(formData)
            .then(res=> {
                console.log(res.data);
                
                if(res.status === 200 && res.data.message != "Check"){
                    setPestID("");
                    toast.success(res.data.message,{ //THE SUCCESS NOTIFICATION
                        position: toast.POSITION.TOP_RIGHT,
                        hideProgressBar: false,
                        autoClose: 2000,

                    });
                }
                else if(res.status === 200 && res.data.message === "Check") //Bad  request status code. That means Conflict : already exist some data 
                {
                    toast.warning("Double check pest id",{ //THE SUCCESS NOTIFICATION
                        position: toast.POSITION.TOP_RIGHT,
                        hideProgressBar: false,
                        autoClose: 2000,
        
                    });
                }
                
            })
            .catch(err=> console.log(err))
        }

        else{
            toast.error('Pest id is required',{ //THE SUCCESS NOTIFICATION
                position: toast.POSITION.TOP_RIGHT,
                hideProgressBar: false,
                autoClose: 2000,

            });
        }

    }
    const removePest = (e,cropId)=> {
        /* Needs to be edited */
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
        /* Needs to be edited */
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
       {userAuth==="Admin" && <div className="addingForm addingForm1">
            <form className="pestsForm pestsFormCrop" autoComplete='off' onSubmit={editPests}>
                <h3>Add pest to this crop</h3>
                <div className="form-groups">
                    <input name="pestID" type="text" placeholder="Pest id" required
                    onChange={e => setPestID(e.target.value)}
                    value={pestID}
                    />
                </div>   
                <button className='adminSave'>Add</button>
            </form>
            <form className="pestsForm pestsFormDB" autoComplete='off' onSubmit={editPests}>
                <h3>Add pest to the database</h3>
                <div className="form-groups form-groupsDB">
                    <input name="pestName" type="text" placeholder="Pest name" required
                    onChange={e => setPestName(e.target.value)}
                    value={pestName}
                    />
                </div>
                <div className="form-groups form-groupsDB">
                    <input className="adminPestDesc" name="cropDesc" type="text" placeholder="Short description" required
                    onChange={e => setPestDesc(e.target.value)}
                    value={pestDesc}
                    />
                </div>
                <div className="imageUploadDiv form-groups form-groupsDB">
                        <input required type="file" accept='image/*' className='imageFile' onChange={showPreview} id="imageUploader"/>
                </div>
                                
                <button className='adminSave'>Save</button>
            </form>
        </div>}
        {userAuth==="Admin" && <div className="existingData">
            <div className="adminHeading">
                <h3>Pests for this crop</h3>
                <h5>({pest.length} items)</h5>
            </div>
            <div className="cropsList">
                {pest.map(p=>(
                    <div className="cropItself" key={p.id}>
                        <p>{p.pName}</p>
                        <img className="adminRemoveIcon" src={DeleteIcon} alt="remove" onClick={e=> removePest(e,p.pId)}/>
                    </div>
                ))
                }
            </div>
        </div>}
        {userAuth==="Admin" && <div className="existingData existingDataDB">
            <div className="adminHeading">
                <h3>All the pests</h3>
                <h5>({pest.length} items)</h5>
            </div>
            <div className="cropsList pestsList">
                {allPest.map(p=>(
                    <div className="cropItself pestItself" key={p.id}>
                        <p>{p.pest} (Pest id = {p.pId})</p>
                        <img className="adminRemoveIcon" src={DeleteIcon} alt="remove" onClick={e=> removePest(e,p.pId)}/>
                    </div>
                ))
                }
            </div>
        </div>}
    </div>
  )
}

export default Admin_Pests