import React from 'react';
import { render } from 'react-dom';
import FieldStore from './stores/FieldStore';
import Store from './stores/Store';
import Layout from './components/Layout';

const runView = (ayx, dataItems, divId) => {
  const fieldStore = new FieldStore(ayx);
  const store = new Store(ayx, dataItems, fieldStore);

  render(
    <Layout store={store} />,
    document.getElementById(divId)
  );
};

export default runView;
