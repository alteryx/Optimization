import React from 'react';
import { render } from 'react-dom';
// import MobxStore from './stores/MobxStore';
import Store from './stores/Store';
// import ConstraintList from './components/ConstraintList';
// import BoundsEditor from './components/BoundsEditor';
import Layout from './Layout';

// const renderConstraintEditor = (ayx, dataItems, divId) => {
//   const store = new MobxStore(ayx, dataItems);
//
//   render(
//     <ConstraintList store={store} />,
//     document.getElementById(divId)
//   );
// };
//
// export default renderConstraintEditor;

// function Layout({ store }) {
//   return (
//     <div>
//       <h4>Add Constraints</h4>
//       <ConstraintList store={store} />
//       {/*<BoundsEditor store={store} />*/}
//     </div>
//   );
// }

const runView = (ayx, dataItems, divId) => {
  // const store = new MobxStore(ayx, dataItems);
  const store = new Store(ayx, dataItems);

  render(
    <Layout store={store} />,
    document.getElementById(divId)
  );
};

export default runView;
