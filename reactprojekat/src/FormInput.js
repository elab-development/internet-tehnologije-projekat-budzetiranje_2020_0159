 
import React from 'react';
 

const FormInput = ({ label, type, name, value, handleChange, required = true }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
      />
    </div>
  );
};

export default FormInput;
