import React, { useState } from "react";
import { AutoComplete } from "antd";


const { Option } = AutoComplete;

export const AutoInput = ({ data, classNme, placeholder, onChangeHandler, initialVal }:any) => {
  const [result, setResult] = useState([]);
  const handleSearch = (value:any) => {
    let res = [];
    if (!value) {
      res = [];
    } else {
      res = data.filter((e:any) => {
        return e.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      });
    }
    setResult(res);
  };
  return (
    <AutoComplete
      onChange={(e) => onChangeHandler(classNme, e)}
      onSearch={handleSearch}
      placeholder={placeholder}
      className={classNme}
      style={{textAlign: 'left'}}
      inputValue={initialVal??''}
    >
      {result.map((value) => (
        <Option key={value} value={value}>
          {value}
        </Option>
      ))}
    </AutoComplete>
  );
};
