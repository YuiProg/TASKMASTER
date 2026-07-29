import PropTypes from "prop-types";
import React from "react";
import './Button.css';
/**
 * @class
 * @component
 */
class Button extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {

        const {
            success,
            error,
            warning,
            maxWidth,
            customWidth,
            submit,
            text,
            onClick,
            disabled,
            cancel,
            className,
            customBorder
        } = this.props;

        return (
            <div>
                <button 
                    type={`${submit ? 'submit' : 'button'}`} 
                    style={{
                        background: `${
                            success ? "#22C55E" 
                            : warning ? "#F59E0B" 
                            : error ? "#EF4444" 
                            : cancel && "transparent"}`,
                        width: `${
                            maxWidth ? "100%" 
                            : customWidth ? `${customWidth}px` 
                            : "auto"
                        }`,
                        border: `${
                            customBorder ? customBorder
                            : cancel ? "1px solid #cbd5e1" 
                            : null
                        }`,
                        color: cancel ? "#334155" : "#ffffff"
                    }}
                    className={`TR-button ${disabled && 'tr-btn-disabled'} ${className || ''}`}
                    onClick={() => onClick()}
                    disabled={disabled}
                >
                    {text}
                </button>
            </div>
        );
    }
}

Button.propTypes = {
    success: PropTypes.bool,
    error: PropTypes.bool,
    warning: PropTypes.bool,
    maxWidth: PropTypes.bool,
    customWidth: PropTypes.number,
    submit: PropTypes.bool,
    text: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    cancel: PropTypes.bool
}

export default Button;