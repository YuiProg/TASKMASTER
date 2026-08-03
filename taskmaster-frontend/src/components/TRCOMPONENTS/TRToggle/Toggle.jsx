import React from 'react'
import './Toggle.scss'

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
      <div className="tr-toggle">
        <div className="tr-toggle__row">
          <label className="tr-toggle__control">
            <input
              type="checkbox"
              checked={isActive || isChecked}
              onChange={this.handleToggle}
            />
            <span className="tr-toggle__switch"></span>
          </label>
          {!hideLabel && (
            <p className={`tr-toggle__subtitle ${isActive ? 'tr-toggle__subtitle--active' : 'tr-toggle__subtitle--inactive'}`}>
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
      <div className="tr-toggle">
        <div className="tr-toggle__row">
          <label className="tr-toggle__control">
            <input
              type="checkbox"
              checked={value ?? false}
              onChange={this.handleToggle}
            />
            <span className="tr-toggle__switch"></span>
          </label>
          {!hideLabel && (
            <p className={`tr-toggle__subtitle ${value ? 'tr-toggle__subtitle--active' : 'tr-toggle__subtitle--inactive'}`}>
              {String(value ?? false)}
            </p>
          )}
        </div>
      </div>
    )
  }
}
