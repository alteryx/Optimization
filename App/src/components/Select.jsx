import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';

function Select({ style, value, disabledFilter, options, onChange }) {
  return (
    <select
      style={ style }
      value={value}
      className="form-control"
      onChange={(e) => onChange(e.target.value)}
    >
      {
        options.map((option, idx) => (
          <option
            key={idx}
            value={option}
            disabled={disabledFilter ? disabledFilter(option) : false}
          >
            {option}
          </option>)
        )
      }
    </select>
  );
}

Select.defaultProps = {
  value: '',
};

Select.propTypes = {
  style: P.object,
  value: P.string.isRequired,
  disabledFilter: P.func,
  options: P.array.isRequired,
  onChange: P.func.isRequired,
};

export default observer(Select);
