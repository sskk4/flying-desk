const FormField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  errorMessage, 
  disabled = false,
}) => {
  return (
    <div className={`form-field ${errorMessage ? "wrong-border" : ""}`}>
      <label htmlFor={id} className={errorMessage ? "wrong-text" : ""}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={errorMessage ? "wrong-text" : ""}
        disabled={disabled} 
      />
    </div>
  );
};

export default FormField;
