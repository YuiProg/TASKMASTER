import React from "react";
import "./InputField.scss";
import { Search, EyeClosed, Eye } from "lucide-react";

/**
 * @class InputField
 * @component Full-stack design system custom input text controller field.
 */
export class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value ? this.props.value : "",
      error: null,
      searchValue: this.props.value ? this.props.value : "",
      showPassword: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value && this.props.value !== undefined) {
      this.setState({
        value: this.props.value,
        searchValue: this.props.value,
      });
    }
  }

  handleChange = (e) => {
    const value = e.target.value;
    const { number, email } = this.props;

    // Handle Number Validation
    if (number) {
      const regex = /^\d+$/;
      if (value === "") {
        this.setState({ error: null, value: "" });
        return "";
      }
      if (regex.test(value)) {
        this.setState({ error: null, value: value });
        return value;
      } else {
        this.setState({ error: "Number only!" });
        return undefined;
      }
    }

    // Handle Email Format Validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.setState({ value: value });

      if (value === "") {
        this.setState({ error: null });
        return value;
      }

      if (!emailRegex.test(value)) {
        this.setState({ error: "Please enter a valid email address (e.g., user@domain.com)" });
        // Return undefined so parent callbacks (like state updates in ViewProject) don't process invalid emails
        return undefined; 
      } else {
        this.setState({ error: null });
        return value;
      }
    }

    // Default fallback for general text/password
    this.setState({ error: null, value: value });
    return value;
  };

  handleSearch = (e) => {
    const value = e.target.value;
    this.setState({ searchValue: value });
    if (this.props.onChange) this.props.onChange(value);
    return value;
  };

  handleEnterDown = (e, CB) => {
    const key = e.key;
    // Don't fire submission if there is an active validation error
    if (key === "Enter" && CB && !this.state.error) {
      return CB(e.target.value);
    }
  };

  render() {
    const {
      required,
      onChange,
      disabled,
      placeholder,
      password,
      isSearch,
      onEnterDown,
      color,
      isRequired,
      email,
      maxLength,
      textColor
    } = this.props;

    return (
      <div className="tr-input">
        {this.state.error && (
          <p className="tr-input__error-message">{this.state.error}</p>
        )}
        <div
          className={`tr-input__wrapper ${this.state.error ? "tr-input__wrapper--error" : ""}`}
        >
          {!isSearch ? (
            <>
              <input
                style={
                  disabled
                    ? { backgroundColor: color, color: textColor || 'white', cursor: "not-allowed" }
                    : { backgroundColor: color }
                }
                type={
                  password
                    ? this.state.showPassword
                      ? "text"
                      : "password"
                    : email
                    ? "email"
                    : "text"
                }
                required={!!(required || isRequired)}
                onChange={(e) => {
                  const val = this.handleChange(e);
                  if (val !== undefined && onChange) onChange(val);
                }}
                disabled={disabled}
                value={this.state.value}
                placeholder=" "
                onKeyDown={(e) => this.handleEnterDown(e, onEnterDown)}
                maxLength={maxLength}
              />
              <label className="tr-input__label">
                  {placeholder}
                  {(required || isRequired) && <span style={{ color: '#8a3634', marginLeft: 2 }}>*</span>}
              </label>
              {password &&
                (this.state.showPassword ? (
                  <Eye
                    className="tr-input__eye-icon"
                    onClick={() => this.setState({ showPassword: false })}
                  />
                ) : (
                  <EyeClosed
                    className="tr-input__eye-icon"
                    onClick={() => this.setState({ showPassword: true })}
                  />
                ))}
            </>
          ) : (
            <>
              <input
                style={
                  disabled
                    ? { backgroundColor: color, cursor: "not-allowed" }
                    : { backgroundColor: color }
                }
                type="text"
                required={required || isRequired}
                onChange={(e) => this.handleSearch(e)}
                disabled={disabled}
                value={this.state.searchValue}
                placeholder=" "
                onKeyDown={(e) => this.handleEnterDown(e, onEnterDown)}
                className="tr-input__search-field"
              />
              <label className="tr-input__label">{placeholder}</label>
              <Search className="tr-input__search-icon" size={15} />
            </>
          )}
        </div>
      </div>
    );
  }
}

export class Label extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
    this.wrapperRef = React.createRef();
  }

  componentWillUnmount() {
    this.removeOutsideListener();
  }

  handleLabelClick = () => {
    if (!this.props.onClick) return;
    this.setState({ isEditing: true }, this.addOutsideListener);
  };

  addOutsideListener = () => {
    document.addEventListener("mousedown", this.handleOutsideClick);
  };

  removeOutsideListener = () => {
    document.removeEventListener("mousedown", this.handleOutsideClick);
  };

  handleOutsideClick = (e) => {
    if (this.wrapperRef.current && !this.wrapperRef.current.contains(e.target)) {
      this.cancelEdit();
    }
  };

  cancelEdit = () => {
    this.removeOutsideListener();
    this.setState({ isEditing: false });
  };

  commitEdit = (value) => {
    this.removeOutsideListener();
    this.setState({ isEditing: false });
    if (this.props.onClick) this.props.onClick(value);
  };

  render() {
    const {
      label,
      value,
      style,
      onClick,
      placeholder,
      className,
      ...inputFieldProps
    } = this.props;

    const editValue = value !== undefined ? value : label;

    if (onClick && this.state.isEditing) {
      return (
        <div ref={this.wrapperRef}>
          <InputField
            {...inputFieldProps}
            text
            value={editValue}
            placeholder={placeholder || label}
            onEnterDown={(val) => this.commitEdit(val)}
          />
        </div>
      );
    }

    return (
      <div>
        <p
          className={`tr-label${className ? ` ${className}` : ""}`}
          style={{ ...style, cursor: onClick ? "pointer" : style?.cursor }}
          onClick={this.handleLabelClick}
        >
          {label}
        </p>
      </div>
    );
  }
}