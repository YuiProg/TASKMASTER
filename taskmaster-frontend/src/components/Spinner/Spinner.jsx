import './Spinner.scss';

const Spinner = ({ size = 40, strokeWidth = 4, color = '#000000', trackColor = '#e5e5e5' }) => {
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