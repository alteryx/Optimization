import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';

function InputBound({ bound, field, onChange, placeholder }) {
  return (
    <input
      type="text"
      className="form-control"
      defaultValue={bound[field]}
      onChange={(e) => onChange(e, field)}
      placeholder={ placeholder || field }
    />
  );
}

InputBound.propTypes = {
  bound: P.object.isRequired,
  field: P.string.isRequired,
  onChange: P.func.isRequired,
  placeholder: P.string,
};

export default observer(InputBound);
