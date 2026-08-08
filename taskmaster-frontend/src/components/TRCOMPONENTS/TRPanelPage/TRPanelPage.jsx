import React from 'react';
import './TRPanelPage.scss';
import DropDown from '../TRDropDown/Dropdown';
import PropTypes from 'prop-types';
import Button from '../TRButton/Button';
import { Menu } from 'lucide-react';
import MobileNavContext from '../../../context/MobileNavContext';


export class RightPanel extends React.Component {
  render() {
    return (
      <div className='tr-right-panel'>
        {this.props.children}
      </div>
    );
  }
}

export class PanelPage extends React.Component {
  static contextType = MobileNavContext;

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
      backButtonLabel,
    } = this.props;
    const { toggleMobileNav } = this.context;

    const mainChildren = React.Children.toArray(this.passPropsToChildren()).filter(
      (child) => child.type !== RightPanel
    );

    return (
      <div className="tr-panel-page">
        <header className="tr-panel-page__topbar">
          <div className="tr-panel-page__header">
            <button
              type="button"
              className="tr-panel-page__nav-burger"
              onClick={toggleMobileNav}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="tr-panel-page__header-texts">
              <h1 className="tr-panel-page__title">{titlePage}</h1>
              {subTitle && <p className="tr-panel-page__subtitle">{subTitle}</p>}
            </div>
          </div>

          <div className="tr-panel-page__top-right">
            {hasBranch && user && user.role.toLowerCase() !== 'clerk' && (
              <div className="tr-panel-page__branch-dropdown">
                <span className="tr-panel-page__branch-label">Branch</span>
                <DropDown
                  isHeader
                  className="tr-panel-page__branch-select"
                  defaultValue={selectedBranch}
                  onChange={(e) => dropDownFunc(e)}
                  options={branchNames}
                />
              </div>
            )}
          </div>
        </header>

        <div className="tr-panel-page__body">
          <div className="tr-panel-page__main">
            {mainChildren}
          </div>
          {filtersOpen && hasTableFilters && (
            <div className="tr-panel-page__right-wrapper">
              {rightPanel}
            </div>
          )}
        </div>

        {hasStepper && (
          <div className='tr-panel-page__stepper'>
            <div className="tr-panel-page__stepper-inner">
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
    const { currentStep, totalSteps, title, maxHeight } = this.props;
    return (
      <div className='tr-panel-card' style={maxHeight && {height: '100%'}}>
        {(currentStep && totalSteps) && (
          <p className='tr-panel-card__step'>{`Step ${currentStep} of ${totalSteps}`}</p>
        )}
        {title && (
          <h2 className='tr-panel-card__title' style={{marginBottom: '0px'}}>{title}</h2>
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
