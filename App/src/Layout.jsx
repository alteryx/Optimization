import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import ConstraintList from './components/ConstraintList';
import FieldList from './components/FieldList';
import Objective from './components/Objective';
import NavTabs from './components/NavTabs';

function Layout({ store }) {
  return (
    <div>
      <button type="button" className="btn btn-sm btn-default" onClick={store.updatePayload.bind(store)}>
        Update Payload
      </button>
      <NavTabs>
        <Objective label="Objective" store={store} />
        <FieldList label="Fields" store={store} />
        <ConstraintList label="Constraints" store={store} />
      </NavTabs>
    </div>
  );
}

Layout.propTypes = {
  store: P.object.isRequired,
};

export default observer(Layout);
