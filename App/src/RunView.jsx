import React from 'react';
import { render } from 'react-dom';
import MobxStore from './Store';
import ConstraintList from './ConstraintList';

const renderConstraintEditor = (ayx, dataItems, divId) => {
  const store = new MobxStore(ayx, dataItems);

  render(
    <ConstraintList store={store} />,
    document.getElementById(divId)
  );
};

export default renderConstraintEditor;
