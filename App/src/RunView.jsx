import React from 'react';
import { render } from 'react-dom';
// import FieldStore from './stores/FieldStore';
import Store from './stores/Store';
import Layout from './Layout';

const runView = (ayx, dataItems, divId) => {
  const store = new Store(ayx, dataItems);

  render(
    <Layout store={store} />,
    document.getElementById(divId)
  );
};

export default runView;
