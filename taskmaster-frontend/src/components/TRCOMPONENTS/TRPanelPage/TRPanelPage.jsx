import React from 'react';
import './TRPanelPage.css';
import DropDown from '../TRDropDown/Dropdown';
import PropTypes from 'prop-types';
import Button from '../TRButton/Button';
import { InputRow } from '../TRInputForm/TRInputForm';

export class RightPanel extends React.Component {
  render() {
    return (
      <div className='tr-panel-right-side'>
        {this.props.children}
      </div>
    );
  }
}

export class PanelPage extends React.Component {
  passPropsToChildren = () => {
    const { hasTableFilters, onFilterToggle } = this.props;

    return React.Children.map(this.props.children, (child) => {
      if (!child) return null;
      if (child.type === RightPanel) return child;
      return React.cloneElement(child, { hasTableFilters, onFilterToggle });
    });
  };

  render() {
    const {
      titlePage,
      subTitle,
      selectedBranch,
      dropDownFunc,
      branchNames,
      user,
      hasBranch,
      hasTableFilters,
      filtersOpen,
      rightPanel,
      onClickNext,
      onClickBack,
      hasStepper,
      nextButtonLabel,
      backButtonLabel
    } = this.props;

    const mainChildren = React.Children.toArray(this.passPropsToChildren()).filter(
      (child) => child.type !== RightPanel
    );

    return (
      <div className="tr-panel-container">
        <header className="tr-panel-topbar">
          <div className="tr-panel-header">
            <h1 className="tr-panel-bigtitle">{titlePage}</h1>
            {subTitle && <p className="tr-panel-sentence">{subTitle}</p>}
          </div>

          <div className="tr-panel-top-right">
            {hasBranch && user && user.role.toLowerCase() !== 'clerk' && (
              <div className="iv-branch-dropdown-wrapper">
                <span className="iv-branch-label-inline">Branch</span>
                <DropDown
                  isHeader
                  className="iv-branch-dd"
                  defaultValue={selectedBranch}
                  onChange={(e) => dropDownFunc(e)}
                  options={branchNames}
                />
              </div>
            )}
          </div>
        </header>

        <div className="tr-panel-body">
          <div className="tr-panel-main">
            {mainChildren}
          </div>
          {filtersOpen && hasTableFilters && (
            <div className="tr-panel-right-wrapper">
              {rightPanel}
            </div>
          )}
        </div>

        {hasStepper && (
          <div className='tr-panel-stepper-container'>
            <div className="tr-panel-stepper-inner">
              <Button error text={backButtonLabel ? backButtonLabel : 'Back'} onClick={() => onClickBack()} />
              <Button success text={nextButtonLabel ? nextButtonLabel : 'Next'} onClick={() => onClickNext()} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export class PanelContainer extends React.Component {
  render() {
    const { currentStep, totalSteps, title } = this.props;
    return (
      <div className='tr-panel-container-child'>
        {(currentStep && totalSteps) && (
          <p className='tr-panel-step'>{`Step ${currentStep} of ${totalSteps}`}</p>
        )}
        {title && (
          <h2 className='tr-panel-container-title'>{title}</h2>
        )}
        {this.props.children}
      </div>
    );
  }
}

PanelPage.propTypes = {
  titlePage: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  selectedBranch: PropTypes.string,
  dropDownFunc: PropTypes.func,
  branchNames: PropTypes.arrayOf(PropTypes.string),
  user: PropTypes.object,
  hasBranch: PropTypes.bool,
  hasTableFilters: PropTypes.bool,
  onFilterToggle: PropTypes.func,
}

RightPanel.propTypes = {
  children: PropTypes.node,
}

PanelContainer.propTypes = {
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
  title: PropTypes.string,
}