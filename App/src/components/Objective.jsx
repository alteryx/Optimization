import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import Editor from './Editor';

function Objective({ store }) {
  const handleChange = (v) => {
    store.updateObjective(v);
  };

  return (
    <Editor value={store.objective} hintList={store.fieldNameArray} onChange={handleChange} />
  );
}

Objective.propTypes = {
  store: P.object.isRequired,
};

export default observer(Objective);
