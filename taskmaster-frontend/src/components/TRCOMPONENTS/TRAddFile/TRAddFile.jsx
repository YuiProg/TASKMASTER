import React from "react";
import './TRAddFile.css';
import { Image } from 'lucide-react';
/**
 * @class
 * @component
 */
class TRAddfile extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            image: this.props.image ? this.props.image : null
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value && this.props.value !== undefined) {
            this.setState({image: this.props.value});
        }
    }

    formatFile = (e) => {
        const image = e.target.files[0];

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = () => {
                resolve(reader.result);
                this.setState({image: reader.result});
            };
            reader.onerror = (error) => reject(error);
        });
    };

    render () {
        const {
            onChange,
            disabled
        } = this.props;

        return (
            <label className="tr-addfile-container">
                {this.state.image 
                ? (
                    <>
                    <input type="file" hidden accept="image/png" onChange={async (e) => onChange(await this.formatFile(e))}/>
                    <div disabled={disabled} className="tr-addfile-details">
                        <img src={this.state.image} alt="image" className="tr-image"/>
                    </div>
                    </>
                ) 
                : (
                    <>
                    <input disabled={disabled} type="file" hidden accept="image/png" onChange={async (e) => onChange(await this.formatFile(e))}/>
                    <div className="tr-addfile-details">
                        <Image size={40}/>
                        <p className="tr-addfile-header">Select Image</p>
                    </div>
                    </>
                )}
            </label>
        );
    }
}

export default TRAddfile;
