import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import ConstraintList from './components/ConstraintList';
import BoundsEditor from './components/BoundsEditor';

function Layout({ store }) {
  return (
    <div>
      <h4>Add Constraints</h4>
      {/*<ConstraintList store={store} />*/}
      <BoundsEditor store={store} />
    </div>
  );
}

Layout.propTypes = {
  store: P.object.isRequired,
};

export default observer(Layout);
