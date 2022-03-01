import Navbar from './components/navbar/navbar';
import Home from './components/home/home';
import AllPests from './components/home/AllPests';
import './App.css';
import Crops from "./components/home/Crops";
import Weeds from './components/home/Weeds';
import PestDescription from './components/home/PestDescription';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import AllDiseases from './components/home/AllDiseases';
import CropsDisease from './components/home/CropsDisease';
import Registration from './components/reg-log/Registration';
import Login from './components/reg-log/Login';
import {useEffect, useState} from 'react';
import Comments from './components/Comments/Comments';
import Footer from './components/Footer/Footer';
import Admin_Crops from './components/home/Admin/Admin_Crops';
import Admin_Pests from './components/home/Admin/Admin_Pests';
import ExampleComment from './components/Comments/ExampleComment';
function App() {

  const[name,setName] = useState(null);
  const[user, setUser] = useState(null);

  useEffect(()=> {

    (
        async () => {
          try{
            const res =  await fetch('https://localhost:44361/api/users/getuser', {
                headers: {"Content-Type": 'application/json;charset=UTF-8'},
                credentials: 'include',
            });
            const content = await res.json();
            setUser(content);
            setName(content[0].uFirstName); // has to be content[0]
          }
          catch(e){
            console.log(e);
          }
        }
    )();
  },[name])


  return (
    
     <Router>
       <div className="App">

           <Navbar name = {name}/>

           <Routes>

              <Route exact path="/" element={ <Home />} />

              <Route path="/registration" element = {<Registration/>} />

              <Route path="/login" element = {<Login/>} />
              
              <Route path="/crops" element= {<Crops/>}/>

              <Route path="/diseases" element= {<CropsDisease/>} />

              <Route path="/diseases/:cropID" element={<AllDiseases/>}/>

              <Route path="/weeds" element= {<Weeds/>} />

              <Route path="/Crops/:cropID" element={<AllPests/>}/>

              <Route path="/Pest/Description/:pestID" element={<PestDescription/>}/>

              <Route path="/Comments" element = {<Comments/>}/>

              <Route path="/Example" element = {<ExampleComment/>}/>

              <Route path='/AdminCrops' element={<Admin_Crops user={user}/>}/>

              <Route path='/AdminPests/:cropID' element={<Admin_Pests user={user}/>}/>

           </Routes>
           {/* <Footer/> */}
      </div>
     </Router>
  );
}

export default App;

/*
  THIRD PARTY PACKAGES INSTALLED
  1. TOASTIFY FOR NOTIFACTION
  2. LEAFLET FOR MAP
  3. AXIOS
  4. MAPTILER
*/

// "browserslist":{"production": [
//   ">0.2%",
//   "not dead",
//   "not op_mini all"
// ],
// "development": [
//   "last 1 chrome version",
//   "last 1 firefox version",
//   "last 1 safari version"
// ]
// }