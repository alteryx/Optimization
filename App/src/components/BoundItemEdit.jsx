import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import InputBound from './InputBound';

function BoundItemEdit({ tempBound, onSubmit, onCancel }) {
  const handleBoundChange = (e, field) => {
    tempBound[field] = e.target.value;
  };

  return (
    <div className="row clearfix">
      <form className="form-inline" onSubmit={onSubmit}>
        <div className="col-xs-3">
          <InputBound
            bound={tempBound}
            field="lowerBound"
            onChange={handleBoundChange}
            placeholder="Lower Bound"
          />
        </div>
        <div style={{ paddingLeft: 5, paddingRight: 5 }} className="col-xs-2">
          <label>
            <h5> &lt;= {tempBound.field} &lt;= </h5>
          </label>
        </div>
        <div className="col-xs-3">
          <InputBound
            bound={tempBound}
            field="upperBound"
            onChange={handleBoundChange}
            placeholder="Upper Bound"
          />
        </div>
        <div className="col-xs-3">
          <div style={{ marginTop: 10 }} className="btn-toolbar pull-right">
            <button type="submit" className="btn btn-success btn-sm">
              <i className="fa fa-check"></i>
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={onCancel}
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
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
