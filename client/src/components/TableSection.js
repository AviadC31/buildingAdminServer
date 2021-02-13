import React, { useContext, useState, useEffect, useRef } from 'react'
import { Table, Button, Popconfirm, Form, Input} from 'antd'
import { columns } from "../columns"
import 'antd/dist/antd.css'
import axios from "axios"
const EditableContext = React.createContext(null)

//Rows dynamic functionality
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

//Cells dynamic functionality
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  //Edit Fields
  const toggleEdit = async (value) => {
    setEditing(!editing)
      if(record._id && editing){
        axios.put(`http://18.193.224.15/tenants-api/tenant/${record._id}`,{
          field: dataIndex, 
          value: value[dataIndex]
        })
      }
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      })
  }

  //Save edits locally
  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit(values)
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.error('Save failed:', errInfo)
    }
  }

  let childNode = children

  //edit functionality
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

//Table display Manage
export default function TableSection({ dataSource, liveData }) {
  const [data, setData] = useState([{}])

  //Update state with tenants data
  useEffect(()=>{
    setData(dataSource)
  },[dataSource])
    
  //Removing tenant from DB by phone number (unique field)
    const handleDelete = (record) => {
      axios.delete(`http://18.193.224.15/tenants-api/tenant/${record.phone}`)
      setData(data.filter((user) => user._id !== record._id))
    }
    
  //Adding a new tenant
    const handleAdd = () => {
      alert("Please fill in the entire line in order to keep the information about the tenant")
      const newData = data ? [...data] : []
        newData.unshift({
            name: '',
            phone: '',
            address: '',
            financialDebt: ''
          })
        setData(newData)
   }

  //Saving fields changes to DB
  const handleSave = (row) => {
    const newData = [...data]
    const index = newData.findIndex((item) => row._id === item._id)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    if( 
       !row._id &&
        row.name &&
        row.phone &&
        row.address &&
        row.financialDebt
        // &&index === 0
      ){
        delete row.operation
      axios.post('http://18.193.224.15/tenants-api/tenant', row)
            .then(r=> newData[index]['_id'] = r.data._id)
            .catch(err=>alert("Input invalid"))
    }
    setData(newData)
    liveData(newData)
  }

  //Rows wrapper for antd props
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  //Columns wrapper for antd props
  const columnsChange = columns.map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    }
  })

    return (
      <div id="tableSection">
        <Button
          onClick={()=>handleAdd()}
          type="primary"
        >
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={data? data.map(tenant=>{
            return{
              ...tenant,
              operation:
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(tenant)}>
              <a href="#0">Delete</a>
            </Popconfirm>
           }
          }):null}
          columns={columnsChange}
        />
      </div>
    )
}

