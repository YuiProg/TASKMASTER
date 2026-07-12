import React from "react";
import './TRInputForm.css';
import PropTypes from "prop-types";
import Button from "../TRButton/Button";


//dito lalagay mga inputfields parang panel tong una
/**
 * @class
 * @component
 */
export class TRInputFormPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    passPropsToChildren = () => {
        const { header, subHeader, onSubmit, isRequired, btnTXT, btnDisabled, noBtn } = this.props;

        //pang pasa ng props dito sa parent sa child (parent props -> children)
        const enhancedChildren = React.Children.map(this.props.children, (child) => {
            if (!child) return null;
            return React.cloneElement(child, {
                onSubmit,          
                header,
                subHeader,
                isRequired,
                btnTXT,
                btnDisabled,
                noBtn
            });
        });

        return enhancedChildren;
    }

    render() {
        const { header, subHeader } = this.props;

        return (
            <div className="tr-inputform-panel-container">
                <div className="tr-inputform-panel-headers">
                    <h1 className="tr-header">{header}</h1>
                    <p className="tr-subheader">{subHeader}</p>
                </div>
                <div>
                    {this.passPropsToChildren()}
                </div>
            </div>
        );
    }
}


export class InputForm extends React.Component {
    constructor (props) {
        super(props);
    }

    passPropsToChildren = () => {
        const { onSubmit, isRequired } = this.props;
        //console.log(this.props);
        const enhancedChildren = React.Children.map(this.props.children, (child) => {
            if (!child) return null;
            return React.cloneElement(child, {
                onSubmit,          
                isRequired
            });
        });

        return enhancedChildren;
    }

    render () {
        const { onSubmit, btnTXT, hasCancel, onCancel, cancelTXT, btnDisabled, noBtn, noBorder } = this.props;
        console.log(this.props);
        return (
            <form className="tr-inputform" onSubmit={(e) => onSubmit(e)} style={noBorder && {border: '0'}}>
                {this.passPropsToChildren()}
                <div className="tr-inputform-actions">
                    {hasCancel && !noBtn ? (
                        <button className="tr-inputform-cancel" type="button" onClick={() => onCancel()}>
                            {cancelTXT || 'CANCEL'}
                        </button>
                    ) : null}
                    {!noBtn && (<button disabled={btnDisabled} style={btnDisabled ? { cursor: 'not-allowed' } : {}} className="tr-inputform-submit" type="submit">{btnTXT || 'SUBMIT'}</button>)}
                </div>
            </form>
        );
    }
}

export class InputRow extends React.Component {
    constructor (props) {
        super(props);
    }  

    passPropsToChildren = () => {
        const { isRequired } = this.props;

        return React.Children.map(this.props.children, (child) => {
            if (!child) return null;
            return React.cloneElement(child, { isRequired });
        });
    }

    render () {
        const { gap, titles, bottomMargin } = this.props;

        const children = this.passPropsToChildren();

        return (
            <div className="tr-inputrow" style={bottomMargin ? { gap: `${gap}px`, marginBottom: '10px' } :{ gap: `${gap}px` }}>
                {React.Children.map(children, (child, i) => (
                    <div className="tr-inputrow-field" key={i}>
                        {titles
                            ? <p className="tr-inputrow-title">{titles[i]}</p>
                            : <span className="tr-inputrow-title-spacer" />
                        }
                        {child}
                    </div>
                ))}
            </div>
        );
    }
}

TRInputFormPanel.propTypes = {
    header:    PropTypes.string,
    subHeader: PropTypes.string,
    onSubmit:  PropTypes.func,
    isRequired:  PropTypes.bool,
    btnTXT:    PropTypes.string,
}

InputForm.propTypes = {
    onSubmit: PropTypes.func,
    isRequired: PropTypes.bool,
    btnTXT:   PropTypes.string,
}

InputRow.propTypes = {
    gap:    PropTypes.number,
    titles: PropTypes.arrayOf(PropTypes.string),
}