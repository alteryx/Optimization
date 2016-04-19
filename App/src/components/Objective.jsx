import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';

function Objective({ store }) {
  const handleChange = (e) => store.objective = e.target.value;
  return (
    <div>
      <input
        className="form-control form-inline"
        type="text"
        value={store.objective}
        onChange={handleChange}
      >
      </input>
    </div>
  );
}

Objective.propTypes = {
  store: P.object.isRequired,
};

export default observer(Objective);
