import React from "react";
import './Modal.css';
import { BadgeCheck, Check, X } from "lucide-react";
import Button from "../components/TRButton/Button";
import ModalStore from "../context/ModalStore";

export class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClosing: false
        };
        
    }
    
    handleClose = () => {
        const { onClose } = this.props;
        const { setSelectedItems } = ModalStore.getState();

        this.setState({ isClosing: true });

        setSelectedItems(null);

        setTimeout(() => {
            onClose();
        }, 150);
    };

    passPropsToChild = () => {
        const { confirm, required, hasCancel } = this.props;

        return React.Children.map(this.props.children, (child) => {
            if (!child) return null;
            return React.cloneElement(child, {
                confirm,
                required,
                hasCancel,
                onCancel: this.handleClose
            });
        });
    };

    render() {
        const { header, subHeader } = this.props;
        const { isClosing } = this.state;

        return (
            <div
                className={`modal-container ${isClosing ? 'closing' : ''}`}
                onClick={this.handleClose}
            >
                <div
                    className={`modal-child ${isClosing ? 'closing' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {header && (
                        <div className="modal-p-header">
                            <div>
                                <h1 className="modal-p-h">{header}</h1>
                                <p className="modal-p-sh">{subHeader}</p>
                            </div>
                            <button 
                                className="modal-close-btn"
                                onClick={this.handleClose}
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    )}
                    {this.passPropsToChild()}
                </div>
            </div>
        );
    }
}

export class ModalConfim extends React.Component {
    constructor (props) {
        super(props);
    }
    
    render () {
        const {
            message,
            onClose
        } = this.props;
        return (
            <div className="modal-container-confirm">
                <div className="" onClick={(e) => e.stopPropagation()}>
                    {/* CHECK MARK */}
                    <div className="modal-check-confirm">
                        <div className="modal-confirm-green-circle">
                            <Check size={80}/>
                        </div>
                        <h1 className="modal-confirm-header">{message}</h1>
                        <Button 
                            success 
                            customWidth={150}
                            text="OKAY" 
                            onClick={() => onClose()}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export class ModalEditItem extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className="modal-container-confirm">
                <div className="modal-edit-container">
                    
                </div>
            </div>
        );
    }
}

export class ModalYesNo extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        const {
            message,
            message2,
            onClose,
            onYes,
            loading
        } = this.props;

        return (
            <div className="modal-container-confirm">
                <div className="modal-container__delete-clerk" onClick={(e) => e.stopPropagation()}>
                    {/* CHECK MARK */}
                    <div className="modal-confirm-texts">
                        <h1 className="modal-confirm-header">{message}</h1>
                        <p className="modal-confirm-subheader">{message2}</p>
                    </div>
                    <div className="modal-yesno-btns">
                        <Button 
                            className="modal-btn-no"
                            maxWidth 
                            text="NO" 
                            onClick={() => onClose()}
                        />
                        <Button 
                            className="modal-btn-yes"
                            disabled={loading} 
                            maxWidth 
                            text="YES" 
                            onClick={() => onYes()}
                        />
                    </div>
                </div>
            </div>

        );
    }
}

export class ModalError extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div>

            </div>
        );
    }
}

