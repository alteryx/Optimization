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
      {props.constraint}
        <span className="pull-right">
          <button className="btn btn-xs btn-danger delete" onClick={props.removeConstraint}>
            x
          </button>
        </span>
    </div>
  );
}

ConstraintItem.propTypes = {
  constraint: React.PropTypes.string,
  editConstraint: React.PropTypes.func,
  removeConstraint: React.PropTypes.func,
  isBeingEdited: React.PropTypes.bool,
};

export default observer(ConstraintItem);
