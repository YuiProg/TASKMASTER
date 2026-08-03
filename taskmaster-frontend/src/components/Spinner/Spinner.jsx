import './Spinner.scss';

const Spinner = ({ size = 40, strokeWidth = 4, color = '#ff4d4d', trackColor = '#2a2a2a' }) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    border: `${strokeWidth}px solid ${trackColor}`,
    borderTop: `${strokeWidth}px solid ${color}`,
  };

  return (
    <div className="spinner">
      <div className="spinner__ring" style={spinnerStyle}></div>
    </div>
  );
};

export default Spinner;