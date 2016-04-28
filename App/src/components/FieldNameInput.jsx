import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';

function FieldNameInput({ store }) {
  const handleChange = (e) => {
    e.preventDefault();
    store.updateFieldNames(e.target.value);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    store.fieldNameArray.forEach(field => store.fieldStore.addField(field));
  };

  return (
    <div className="input-group">
      <input
        style={{ marginTop: 0 }}
        type="text"
        className="form-control input-sm"
        value={store.fieldNames}
        placeholder="x1, x2, x3"
        onChange={handleChange}
      />
      <span className="input-group-btn">
        <button type="button" className="btn btn-sm btn-primary" onClick={handleAdd}>
          <i className="fa fa-plus"></i>
        </button>
      </span>
    </div>
  );
}

FieldNameInput.propTypes = {
  store: P.object,
};

export default observer(FieldNameInput);
