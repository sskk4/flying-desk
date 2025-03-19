import React from "react";
import "../../components/Form/FormField.css";

const FormField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  errorMessage,
}) => {
  const handleInputChange = (e) => {
    onChange(id, e.target.value); 
  };

  return (
    <div className={`form-field ${errorMessage ? "wrong-border" : ""}`}>
      <label htmlFor={id} className={errorMessage ? "wrong-text" : ""}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value || ""}
        onChange={handleInputChange}
        placeholder={placeholder}
        autoComplete="off"
        className={errorMessage ? "wrong-text" : ""}
      />
    </div>
  );
};

export default FormField;
