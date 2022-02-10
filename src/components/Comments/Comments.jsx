import React,{useState, useEffect} from 'react'
import "./Comments.css"
import axios from 'axios'
import {toast} from 'react-toastify';
import Comment from './Comment';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from 'react-router-dom'

toast.configure()
const initialImageValues = {
    imageName: '',
    imageSrc : '',
    imageFile : null
}
const Comments = () => {
    const[comment,setComment] = useState("");
    const[allComments,setAllComments] = useState([]);
    const[loading, setLoading] = useState(true);
    const[loading1, setLoading1] = useState(true);
    const[userFirstName,setUserFirstName] = useState(true);
    const[userId,setUserId] = useState(null);
    const[userEmail,setUserEmail] = useState(null);
    const[imgValues,setImgValues] = useState(initialImageValues);
    const [userAuth, setUserAuth] = useState(null);  

    // const postComment = (e) => {
    //     e.preventDefault();
    //     setComment("");
    //         fetch('https://localhost:44361/api/comments/postComment', {
    //             method: 'POST',
    //             headers: {"Content-Type": 'application/json;charset=UTF-8'},
    //             body : JSON.stringify({
    //                 UId: userId,
    //                 UEmail: userEmail,
    //                 FComment: comment,
    //                 FImageName: imgValues.imageSrc,
    //                 FImageFile: imgValues.imageFile
    //             })
    //         }).then(()=> {
    //             setLoading(true);
    //             console.log(imgValues);
    //             toast.success('Comment has been posted',{
    //                 position: toast.POSITION.TOP_RIGHT,
    //                 hideProgressBar: false,
    //                 autoClose: 2000,
    
    //             });
                
    //             //window.location.reload();
    //         })
    // }
    
    const postComment = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('UId', userId);
        formData.append('UEmail', userEmail);
        formData.append('FComment', comment);
        formData.append('FImageName', imgValues.imageName);
        formData.append('FImageFile', imgValues.imageFile);

        exampleAPI().create(formData)
        .then( res => {
            
            setComment(""); // AFTER THE COMMENT IS POSTED THE COMMENT GET CLEARED FROM THE COMMENT BOX
            document.getElementById('imageUploader').value = null; //THE CHOSEN IMAGE FILE NAME GET CLEARED AFTER COMMENT HAS BEEN POSTED
            setLoading(true);
            console.log(imgValues);
            toast.success('Comment has been posted',{ //THE SUCCESS NOTIFICATION
                position: toast.POSITION.TOP_RIGHT,
                hideProgressBar: false,
                autoClose: 2000,

            });
        })
        .catch(err=> console.log(err))
    }

    const exampleAPI = (url = 'https://localhost:44361/api/comments/postComment') => {
        return {
            create : newRecord => axios.post(url,newRecord),
            delete: id => axios.delete(url + id)
        }
    }

    const getUser = async () =>{
       
        try{
            const res = await fetch('https://localhost:44361/api/users/getuser', {
                headers: {"Content-Type": 'application/json;charset=UTF-8'},
                credentials: 'include',
            });
            const content = await res.json();
            setUserId(content[0].uId);
            setUserFirstName(content[0].uFirstName);
            setUserEmail(content[0].uEmail);
            setUserAuth(content[0].uAuthLevel)
            
            setLoading1(false);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        if (loading1) {
            getUser();
        }
        loadComments();
        if (loading) {
            loadComments();
        }
        
    },[loading,loading1,allComments])

    const loadComments = async () =>{ //Load all the comments into allComments state
        
        try{
           const res =  await axios.get("https://localhost:44361/api/comments/getall")
           .then((response) => {
               return response.data;
           });
           setAllComments(res);
           setLoading(false);
        }catch(err){
            console.log(err);
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
        <div>
            <div className="commentBoxContainer">
                {userId? <div className="header">
                    <h2>Let us know</h2>
                    <form className="comForm" autoComplete='off' onSubmit={postComment}>
                        <div className="commentBox">
                            <input className="comInput" name="comment" type="text" placeholder="Write your comment"
                                onChange={e => setComment(e.target.value)}
                                value={comment}
                            />
                            <div className="imageUploadDiv">
                                <input type="file" accept='image/*' className='imageFile' onChange={showPreview} id="imageUploader"/>
                            </div>
                            
                            <button>Comment</button>
                        </div>
                    </form>
                </div>:
                <div className='ableToComment'>
                    <h2>You have to be logged in to be able to comment</h2>
                    <Link to="/login">
                        <button> Login </button>
                    </Link>
                    <p>Don't have an account? 
                        <Link to="/registration">
                            <a> Register</a>
                        </Link>
                    </p>
                </div>
                }

                <div className="commentsArea">
                    {allComments.map(c=> (
                        <Comment userId = {userId} userAuth = {userAuth} userName= {userFirstName} userEmail = {userEmail} FId={c.fId} uName = {c.uName} uComment={c.comment} uImageName = {c.imageName} uImageSrc = {c.imageSrc} uTime={c.time}/>
                    )
                    )}
                </div>
            </div>
        </div>
    )
}

export default Comments
