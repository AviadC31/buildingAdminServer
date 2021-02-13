import React, { useState, useEffect } from 'react'
import FilterDataSection from './components/FilterDataSection'
import TableSection from './components/TableSection'
import { Input, Button } from "antd"
import Login from './components/Login&Register'
import axios from "axios"
import "antd/dist/antd.css"
import './App.css'
const { Search } = Input

  export default function App() {
    const [tenantsData, setTenantsData] = useState([{}])
    const [filterdData, setFilterdData] = useState([{}])
    const [remember, setRemember] = useState(true)
    const [inputVal, setInputVal] = useState(true)
    const [isSignd, setIsSignd] = useState(false)
    const [hint, displayHint] = useState(false)
    const [err, setErr] = useState(false)
    const textInput = React.createRef()

    //landing
    useEffect(()=>{
      isLogged()
    },[])

    //remeber user handle while leaving site
    window.addEventListener("beforeunload", () => {if(!remember) localStorage.clear()})

    //Signing Out user
    const signOut = async() => {
      const token = await localStorage.getItem('token')
      axios.post('http://18.193.224.15/users-api/sign-out',{} ,{
        headers: {
            'Authorization': token
          }
        })
      setIsSignd(false)
      console.log(remember)
      if(!remember) localStorage.clear()
    }

    //login check handle
    const isLogged = async () =>{
      const token = await localStorage.getItem('token')
      if(token){
        axios.get('http://18.193.224.15/tenants-api/tenants', {
            headers: {
                'Authorization': token
              }
            })
            .then(r => {
                setIsSignd(true)
                setErr(false)
                setTenantsData(r.data)
                setFilterdData(r.data)
              })
            .catch((error) => {
                console.error(error)
              })
      }
    }
    
    //search handle with validation
    const handleClick = () => {
      let value = textInput.current.state.value
      if(value && value.length <40 && value.length > 0){
        setInputVal(true)
        if(value === 'all'){
          setFilterdData([...tenantsData])
          setErr(false)
        } 
        else{
          
          const filterd = tenantsData.filter(f=> f.name.includes(value) ||
                                                 f.phone.includes(value) ||
                                                 f.address.includes(value)
                                            )
          if(filterd.length > 0){
            setErr(false)
            setFilterdData(filterd)
          } 
          else setErr(true)
        } 
      } else setInputVal(false)
    } 
    
    //filter results handle
    const filterData = data =>{
      if (data.length === 0) data.push({})
      setFilterdData(data)
    }
    
    return (
      <>
      <div id="title">Building Tenants Adminisiter</div>
      {
        isSignd?
          <>
            <Button
             type="primary"
             htmlType="submit"
             className="login-form-button"
             onClick={()=>signOut()}
             style={{
              position: 'absolute',
              left: '2vw'
            }}
            >
              Sign Out
            </Button >
            <div>
              <Search
                ref={textInput}
                id={inputVal? 'correctInp' : 'wrongInp'}
                label="Tester Name"
                placeholder="Enter any tenant detail"
                onSearch={handleClick}
                onMouseEnter={()=>displayHint(true)}
                onMouseLeave={()=>displayHint(false)}
              />
              <p className={err ? 'errOn' : 'errOff'}>tenant doesn't exist</p>
            </div>
            <span id={hint? "hint" : "hidden"}>Search 'all' for all tenants information</span>
            <FilterDataSection data={tenantsData} filterData={filterData}/>
            <TableSection
                    dataSource={filterdData[0]._id ? filterdData : null }
                    liveData={setTenantsData}
            />
          </>
        :
        <Login isLogged={isLogged} remember={setRemember}/>
      }
    </>
  )
}