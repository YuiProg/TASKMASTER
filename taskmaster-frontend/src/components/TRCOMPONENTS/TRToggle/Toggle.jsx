import React from 'react'
import './Toggle.css'

/**
 * @class
 * @component
 */
export class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: props.currentStatus || "ACTIVE" };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentStatus !== this.props.currentStatus) {
      this.setState({ status: this.props.currentStatus });
    }
  }

  handleToggle = () => {
    const newStatus = this.state.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    this.setState({ status: newStatus });
    if (this.props.onToggle) {
      this.props.onToggle(newStatus);
    }
  };

  render() {
    const isActive = this.state.status === "ACTIVE";
    const { isChecked, hideLabel } = this.props;
    return (
      <div className="toggle-container">
        <div className="toggle-btn">
          <label className="toggle-btn-control">
            <input 
              type="checkbox"
              checked={isActive || isChecked}
              onChange={this.handleToggle}
            />
            <span className="toggle-switch"></span>
          </label>
          {!hideLabel && (
            <p className={`toggle-subtitle ${isActive ? 'ACTIVE' : 'INACTIVE'}`}>
              {isActive ? "Active" : "Inactive"}
            </p>
          )}
        </div>
      </div>
    );
  }
}

/**
 * @class
 * @component
 */
export class BooleanToggle extends React.Component {
  handleToggle = () => {
    const newValue = !this.props.value
    if (this.props.onChange) {
      this.props.onChange(newValue)
    }
  }

  render() {
    const { value, hideLabel } = this.props
    return (
      <div className="toggle-container">
        <div className="toggle-btn">
          <label className="toggle-btn-control">
            <input
              type="checkbox"
              checked={value ?? false}
              onChange={this.handleToggle}
            />
            <span className="toggle-switch"></span>
          </label>
          {!hideLabel && (
            <p className={`toggle-subtitle ${value ? 'true' : 'false'}`}>
              {String(value ?? false)}
            </p>
          )}
        </div>
      </div>
    )
  }
}