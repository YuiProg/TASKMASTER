import React from "react";
import "./Radio.css";
/**
 * @class
 * @component
 */
class Radio extends React.Component {
    render() {
        const { filters, onFilterChange } = this.props;

        return (
            <div className="settings-demo">
                {/* AVAILABILITY TOGGLE */}
                <div className="setting-row">
                    <label className="setting-control">
                        <input
                            type="checkbox"
                            checked={filters.availability === "ACTIVE"}
                            onChange={() => onFilterChange("availability", "ACTIVE")}
                        />
                        <span className="switch switch--availability"></span>
                    </label>

                    <div
                        className="setting-text"
                        onClick={() =>
                            onFilterChange(
                                "availability",
                                filters.availability === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                            )
                        }
                        style={{ cursor: "pointer" }}
                    >
                        <div className="setting-title">Availability</div>
                        <div className="setting-subtitle">
                            {filters.availability === "ACTIVE" ? "Show all branches" : "Show active only"}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Radio;