import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import FieldNameInput from './components/FieldNameInput';
import ConstraintList from './components/ConstraintList';
import FieldList from './components/FieldList';
import Objective from './components/Objective';
import NavTabs from './components/NavTabs';

function Layout({ store }) {
  return (
    <div className="container">
      <div className="row spacer-10">
        <FieldNameInput store={store} />
      </div>
      <div className="row">
        <NavTabs selected={store.selectedTab} onSelect={store.updateSelectedTab}>
          <FieldList label="Fields" store={store} />
          <Objective label="Objective" store={store} />
          <ConstraintList label="Constraints" store={store} />
        </NavTabs>
      </div>
    </div>
  );
}

Layout.propTypes = {
  store: P.object.isRequired,
};

export default observer(Layout);
