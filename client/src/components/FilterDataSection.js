import React from "react";
import  Filter  from "./FilterPopup";

//Handle results display options
export default function FilterDataSection({ data, filterData }) {

  const handleFilter = key => {
    const selected = parseInt(key);
    if (selected === 3) {
      filterData(data)
    }
    else if (selected === 2) {
      const filterdData = data.filter(
        ({ financialDebt }) => financialDebt == 0
        )
        filterData(filterdData)
      }
      else if (selected === 1){
        const filterdData = data.filter(
          ({ financialDebt }) => financialDebt > 0
          )
          filterData(filterdData)
        }
      }
    return ( <Filter filterBy={handleFilter}/> )
}




