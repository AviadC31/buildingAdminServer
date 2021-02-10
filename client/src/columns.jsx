export const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      editable: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      editable: true,
      sorter: (a, b) => a.address.localeCompare(b.address)
    },
    {
      title: "Financial Debt [$]",
      dataIndex: "financialDebt",
      key: "financialDebt",
      editable: true,
      sorter: (a, b) => a.financialDebt-b.financialDebt
    },
    {
      title: 'Operation',
      key: 'operation',
      dataIndex: 'operation'
    }
  ]
  

