import React from 'react';
import { render } from 'react-dom';
import FieldStore from './stores/FieldStore';
import ConstraintStore from './stores/ConstraintStore';
import Store from './stores/Store';
import Layout from './Layout';

const runView = (ayx, dataItems, divId) => {
  const fieldStore = new FieldStore(ayx);
  const constraintStore = new ConstraintStore();
  const store = new Store(ayx, dataItems, fieldStore, constraintStore);

  render(
    <Layout store={store} />,
    document.getElementById(divId)
  );
};

export default runView;
