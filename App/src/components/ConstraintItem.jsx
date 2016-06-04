import React from 'react';
import { observer } from 'mobx-react';
import { iconImages } from '../Utils';


function ConstraintItem(props) {
  const isBeingEdited = props.isBeingEdited ? ' list-group-item-editing' : '';

  return (
    <div
      className={`list-group-item clearfix constraint-item ${isBeingEdited}`}
      onDoubleClick={props.editConstraint}
      style={{ cursor: 'pointer' }}
    >
      {props.constraint.value}
        <span className="pull-right">
          <a href="#" className="default-button smallButton" onClick={props.removeConstraint}>
            <img style={{ width: 12, height: 12 }} src={iconImages.trash} />
          </a>
        </span>
    </div>
  );
}

ConstraintItem.propTypes = {
  constraint: React.PropTypes.object,
  editConstraint: React.PropTypes.func,
  removeConstraint: React.PropTypes.func,
  isBeingEdited: React.PropTypes.bool,
};

export default observer(ConstraintItem);
