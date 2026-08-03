import React from "react";
import "./Radio.scss";
/**
 * @class
 * @component
 */
class Radio extends React.Component {
    render() {
        const { filters, onFilterChange } = this.props;

        return (
            <div className="tr-radio">
                {/* AVAILABILITY TOGGLE */}
                <div className="tr-radio__row">
                    <label className="tr-radio__control">
                        <input
                            type="checkbox"
                            checked={filters.availability === "ACTIVE"}
                            onChange={() => onFilterChange("availability", "ACTIVE")}
                        />
                        <span className="tr-radio__switch tr-radio__switch--availability"></span>
                    </label>

                    <div
                        className="tr-radio__text"
                        onClick={() =>
                            onFilterChange(
                                "availability",
                                filters.availability === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                            )
                        }
                        style={{ cursor: "pointer" }}
                    >
                        <div className="tr-radio__title">Availability</div>
                        <div className="tr-radio__subtitle">
                            {filters.availability === "ACTIVE" ? "Show all branches" : "Show active only"}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Radio;