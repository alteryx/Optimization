import React from 'react';
import { observer } from 'mobx-react';

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
          <a href="#" className="text-danger" onClick={props.removeConstraint}>
            <i className="fa fa-trash fa-lg"></i>
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
