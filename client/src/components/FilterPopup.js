import React from "react";
import Menu from "antd/lib/menu";
import "antd/lib/menu/style/css";
import Dropdown from "antd/lib/dropdown";
import "antd/lib/dropdown/style/css";
import { DownOutlined } from "@ant-design/icons";
import "antd/lib/icon/style/css";

//Handle results display filter
export default function Filter({ filterBy }) {

  const onClick = ({ key }) => {
    filterBy(key);
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1">Debted</Menu.Item>
      <Menu.Item key="2">Undebted</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Clear Filter</Menu.Item>
    </Menu>
  );

  return (
    <div >
      <Dropdown className="filter" overlay={menu}>
        <a className="ant-dropdown-link" href="#0">
          Filter By <DownOutlined />
        </a>
      </Dropdown>
    </div>
  );
};
