import React from "react";
import "./InputField.css";
import { Search, EyeClosed, Eye } from "lucide-react";

/**
 * @class InputField
 * @component Full-stack design system custom input text controller field.
 */
class InputField extends React.Component {
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

  checkNumber = (e) => {
    const value = e.target.value;
    const { number, text, password, email } = this.props;
    const regex = /^\d+$/;

    if (value === "") {
      this.setState({ error: null, value: "" });
      return value;
    }

    if (text || password || email) {
      this.setState({ error: null, value: value });
      return value;
    }

    if (number) {
      if (regex.test(value)) {
        this.setState({ error: null, value: value });
        return value;
      } else {
        this.setState({ value: "", error: "Number only!" });
      }
    }
  };

  handleSearch = (e) => {
    const value = e.target.value;
    this.setState({ searchValue: value });
    if (this.props.onChange) this.props.onChange(value);
    return value;
  };

  handleEnterDown = (e, CB) => {
    const key = e.key;
    if (key === "Enter" && CB) {
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
      <div className="input-container">
        {this.state.error && (
          <p className="input-error-message">{this.state.error}</p>
        )}
        <div
          className={`input-wrapper ${this.state.error ? "input-error" : ""}`}
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
                  const val = this.checkNumber(e);
                  if (val !== undefined && onChange) onChange(val);
                }}
                disabled={disabled}
                value={this.state.value}
                placeholder=" "
                onKeyDown={(e) => this.handleEnterDown(e, onEnterDown)}
                maxLength={maxLength}
              />
              <label className="floating-label">
                  {placeholder}
                  {(required || isRequired) && <span style={{ color: '#8a3634', marginLeft: 2 }}>*</span>}
              </label>
              {password &&
                (this.state.showPassword ? (
                  <Eye
                    className="eye-icon"
                    onClick={() => this.setState({ showPassword: false })}
                  />
                ) : (
                  <EyeClosed
                    className="eye-icon"
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
                className="search-input"
              />
              <label className="floating-label">{placeholder}</label>
              <Search className="search-icon" size={15} />
            </>
          )}
        </div>
      </div>
    );
  }
}

export default InputField;