import React from "react";
import './Modal.scss';
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
                className={`tr-modal__overlay ${isClosing ? 'tr-modal__overlay--closing' : ''}`}
                onClick={this.handleClose}
            >
                <div
                    className={`tr-modal__panel ${isClosing ? 'tr-modal__panel--closing' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {header && (
                        <div className="tr-modal__header">
                            <div>
                                <h1 className="tr-modal__title">{header}</h1>
                                <p className="tr-modal__subtitle">{subHeader}</p>
                            </div>
                            <button
                                className="tr-modal__close-btn"
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
            <div className="tr-modal__overlay">
                <div className="" onClick={(e) => e.stopPropagation()}>
                    {/* CHECK MARK */}
                    <div className="tr-modal__panel--confirm">
                        <div className="tr-modal__confirm-icon">
                            <Check size={80}/>
                        </div>
                        <h1 className="tr-modal__confirm-title">{message}</h1>
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
            <div className="tr-modal__overlay">
                <div className="tr-modal__edit-panel">

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
            <div className="tr-modal__overlay">
                <div className="tr-modal__panel--yesno" onClick={(e) => e.stopPropagation()}>
                    {/* CHECK MARK */}
                    <div className="tr-modal__confirm-texts">
                        <h1 className="tr-modal__confirm-title">{message}</h1>
                        <p className="tr-modal__confirm-subtitle">{message2}</p>
                    </div>
                    <div className="tr-modal__actions">
                        <Button
                            className="tr-modal__action-btn--no"
                            maxWidth
                            text="NO"
                            onClick={() => onClose()}
                        />
                        <Button
                            className="tr-modal__action-btn--yes"
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

