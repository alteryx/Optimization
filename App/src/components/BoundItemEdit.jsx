import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import InputBound from './InputBound';
import { iconImages } from '../Utils';

function BoundItemEdit({ tempBound, onSubmit, onCancel }) {
  const handleBoundChange = (e, field) => {
    tempBound[field] = e.target.value;
  };

  return (
    <div className="row">
      <form className="form-inline">
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
        <div style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 5 }} className="col-xs-3">
          <div className="btn-toolbar center-block">
            <button
              type="button"
              style={{ height: 'auto', width: 'auto' }}
              className="btn smallButton btn-transparent"
              onClick={onSubmit}
            >
              <img src={iconImages.save} />
            </button>
            <button
              type="button"
              className="btn smallButton btn-transparent"
              onClick={onCancel}
            >
              <img src={iconImages.undo} />
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
