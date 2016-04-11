import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import InputBound from './InputBound';

function BoundItemEdit({ tempBound, onSubmit, onCancel }) {
  const handleBoundChange = (e, field) => {
    tempBound[field] = e.target.value;
  };

  return (
    <div className="list-group-item clearfix">
      <form className="form-inline" onSubmit={onSubmit}>
        <InputBound
          bound={tempBound}
          field="lowerBound"
          onChange={handleBoundChange}
          placeholder="Lower Bound"
        />
        <label style={{ marginLeft: 10, marginRight: 10 }}>
          <h4> &lt;= {tempBound.field} &lt;= </h4>
        </label>
        <InputBound
          bound={tempBound}
          field="upperBound"
          onChange={handleBoundChange}
          placeholder="Upper Bound"
        />
        <div style={{ marginTop: 10 }} className="btn-toolbar pull-right">
          <button type="submit" className="btn btn-success">save</button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onCancel}
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
}

BoundItemEdit.propTypes = {
  tempBound: P.object.isRequired,
  onSubmit: P.func.isRequired,
  onCancel: P.func.isRequired,
};

export default observer(BoundItemEdit);
