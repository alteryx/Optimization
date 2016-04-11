import React from 'react';
import { render } from 'react-dom';
// import MobxStore from './stores/MobxStore';
import Store from './stores/Store';
import Layout from './components/Layout';

const runView = (ayx, dataItems, divId) => {
  // const store = new MobxStore(ayx, dataItems);
  const store = new Store(ayx, dataItems);

  render(
    <Layout store={store} />,
    document.getElementById(divId)
  );
};

export default runView;
