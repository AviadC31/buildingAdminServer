import React, { useState } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import axios from "axios"

//handle login / Register pages
export default function NormalLoginForm({ isLogged, remember }){
  const [isRegisterd, setIsRegisterd] = useState(true)
  const [err, setErr] = useState(false)

//Handle remembernce to localstorage
  const handleCheckClick=(e)=>{
    remember(e.target.checked)
  }

//set events in server
  const onFinish = (values) => {
    if(isRegisterd){
      axios.post('http://localhost:8080/users-api/sign-in', values) 
            .then(r=>{
              localStorage.setItem('token', r.data.accessToken)
              isLogged()
              setErr(false)
            })
            .catch(err=>setErr(true))
    }else{
      axios.post('http://localhost:8080/users-api/register', values) 
      .then(r=>{
        setIsRegisterd(true)
        setErr(false)
      })
      .catch(err=>setErr(true))
    }
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <p className={err ? 'errOn' : 'errOff'}>{isRegisterd? "Username doesn't exist" : "Username in use"}</p>
      {
        isRegisterd ?
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle >
            <Checkbox onChange={(e)=>handleCheckClick(e)} >Remember me</Checkbox>
          </Form.Item>
        </Form.Item>
        :
        null
      }
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" >
          { isRegisterd ? <>Sign in</>:<>Register</> }
        </Button>
        <br/>
        { isRegisterd ? 
          <span onClick={()=>setErr(false)}>
             Or <a href="#0" onClick={()=>setIsRegisterd(false)}>register now!</a>
          </span>
          :null 
        }
      </Form.Item>
    </Form>
  );
};
