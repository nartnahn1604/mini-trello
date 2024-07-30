import { createContext, useContext } from "react";
import useValidate from "./useValidate";
import Form from "react-bootstrap/Form";
import ReactSelect from "react-select";
import "./FormInput.scss";

const FormInputContext = createContext();

export const useFormInput = () => {
  return useContext(FormInputContext);
};

export default function FormInput({
  children,
  className,
  id,
  onSubmit,
  initialValues,
  validationSchema,
}) {
  const validate = useValidate(onSubmit, initialValues, validationSchema);

  return (
    <FormInputContext.Provider value={validate}>
      <Form
        noValidate
        className={className}
        id={id}
        onSubmit={validate.handleSubmit}
      >
        {children}
      </Form>
    </FormInputContext.Provider>
  );
}

function Text({
  name,
  label,
  value,
  title,
  placeholder,
  className,
  labelClassname,
  inputClassName,
  invalidClassName,
  required,
  type,
  horizontal,
  isHidden,
  onChange,
  onBlur,
}) {
  const validate = useContext(FormInputContext);
  return (
    <Form.Group
      controlId={name}
      className={`form-text-wrapper ${
        validate
          ? validate.touched[name] && validate.errors[name]
            ? invalidClassName
            : ""
          : ""
      } ${className ? className : ""} ${horizontal ? "horizontal" : ""}`}
      hidden={isHidden}
    >
      {label && (
        <Form.Label className={labelClassname}>
          {label}
          {required ? <span className="required">*</span> : ""}
        </Form.Label>
      )}
      <div>
        <Form.Control
          type={type}
          name={name}
          className={`form-text ${inputClassName ? inputClassName : ""}`}
          value={
            validate && value === undefined ? validate.values[name] : value
          }
          onChange={
            validate && onChange === undefined
              ? validate.handleChange
              : onChange
          }
          onBlur={
            validate && onBlur === undefined ? validate.handleBlur : onBlur
          }
          isInvalid={
            validate ? validate.touched[name] && validate.errors[name] : false
          }
          title={title}
          placeholder={placeholder}
        />
        <Form.Control.Feedback type="invalid">
          {validate ? validate.errors[name] : ""}
        </Form.Control.Feedback>
      </div>
    </Form.Group>
  );
}

function Checkbox({ name, label, ...props }) {}
function Select({
  name,
  label,
  options,
  isClearable,
  isDisabled,
  isMulti,
  isSearchable,
  maxMenuHeight,
  placeholder,
  value,
  onChange,
  onBlur,
  required,
  labelClassName,
  inputClassName,
  className,
  horizontal,
}) {
  const validate = useContext(FormInputContext);
  const customStyles = {
    indicatorSeparator: (baseStyles, state) => ({
      ...baseStyles,
      display: "none",
    }),
    dropdownIndicator: (baseStyles, state) => ({
      ...baseStyles,
      paddingTop: "0px",
      paddingBottom: "0px",
    }),
    clearIndicator: (baseStyles, state) => ({
      ...baseStyles,
      padding: "0px",
    }),
    valueContainer: (baseStyles, state) => ({
      ...baseStyles,
      padding: "0px 8px",
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused
        ? "var(--bg-black)"
        : validate && validate.touched[name] && validate.errors[name]
        ? "var(--border-invalid)"
        : "hsl(0, 0%, 80%)",
      boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(56, 52, 52, 0.25)" : "",
      "&:hover": {
        borderColor: state.isFocused
          ? "var(--bg-black)"
          : validate && validate.touched[name] && validate.errors[name]
          ? "var(--bs-invalid)"
          : "hsl(0, 0%, 70%)",
      },
      minHeight: 31,
    }),
  };

  //   const formatGroupLabel = (data) => (
  //     <div
  //       style={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "space-between",
  //       }}
  //     >
  //       <span>{data.label}</span>
  //       <span
  //         style={{
  //           backgroundColor: "var(--bs-primary)",
  //           borderRadius: "2em",
  //           color: "white",
  //           display: "flex",
  //           justifyContent: "center",
  //           padding: "0 8px",
  //           fontSize: "0.8em",
  //           marginRight: 5,
  //         }}
  //       >
  //         {data.options.length}
  //       </span>
  //     </div>
  //   );
  return (
    <div
      className={`form-select ${className ? className : ""} ${
        horizontal ? "horizontal" : ""
      }`}
    >
      {label && (
        <label className={labelClassName}>
          {label}
          {required ? <span className="required">*</span> : ""}
        </label>
      )}

      <ReactSelect
        name={name}
        className={`${inputClassName}`}
        options={options}
        captureMenuScroll={true}
        styles={customStyles}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isMulti={isMulti}
        isSearchable={isSearchable}
        maxMenuHeight={maxMenuHeight ? maxMenuHeight : 200}
        menuPosition={"fixed"}
        value={validate && value === undefined ? validate.values[name] : value}
        onChange={
          validate && onChange === undefined
            ? (selected) => validate.setFieldValue(name, selected)
            : onChange
        }
        onBlur={
          validate && onBlur === undefined
            ? (e) => validate.setFieldTouched(name, true)
            : onBlur
        }
        placeholder={placeholder}
        // formatGroupLabel={groupOption ? formatGroupLabel : undefined}
      />

      {validate && validate.touched[name] && validate.errors[name] ? (
        <div className="errors">{validate.errors[name]}</div>
      ) : (
        ""
      )}
      {/* {info && (
        <span
          className="help"
          data-tooltip-id="my-tooltip"
          data-tooltip-content={info}
          style={{ position: "relative", marginLeft: "8px", top: "4px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="22px"
            height="22px"
          >
            <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z" />
          </svg>
        </span>
      )} */}
    </div>
  );
}

FormInput.Text = Text;
FormInput.Select = Select;
FormInput.Checkbox = Checkbox;
