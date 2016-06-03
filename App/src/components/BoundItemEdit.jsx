import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import InputBound from './InputBound';

function BoundItemEdit({ tempBound, onSubmit, onCancel }) {
  const handleBoundChange = (e, field) => {
    tempBound[field] = e.target.value;
  };

  return (
    <div className="row">
      <form className="form-inline" onSubmit={onSubmit}>
        <div className="col-xs-4">
          <InputBound
            bound={tempBound}
            field="lowerBound"
            onChange={handleBoundChange}
            placeholder="Lower Bound"
          />
        </div>
        <div style={{ paddingLeft: 5, paddingRight: 5 }} className="col-xs-1">
          <h5
            style={{ marginTop: 5, marginBottom: 5, paddingTop: 4 }}
            className="text-center"
          >
            {tempBound.field}
          </h5>
        </div>
        <div className="col-xs-4">
          <InputBound
            bound={tempBound}
            field="upperBound"
            onChange={handleBoundChange}
            placeholder="Upper Bound"
          />
        </div>
        <div style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 10 }} className="col-xs-3">
          <div className="btn-toolbar center-block">
            <button type="submit" className="btn btn-success btn-xs">
              <i className="fa fa-check"></i>
            </button>
            <button
              type="button"
              className="btn btn-danger btn-xs"
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
