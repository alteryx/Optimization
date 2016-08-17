import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import SplashScreen from './components/SplashScreen';
import FieldNameInput from './components/FieldNameInput';
import ConstraintList from './components/ConstraintList';
import FieldList from './components/FieldList';
import Objective from './components/Objective';
import NavTabs from './components/NavTabs';

function Layout({ store }) {
  return (
    <div className="container">
      <div className="row spacer-10">
        <label>Variable List</label>
        <FieldNameInput store={store} />
      </div>
      <div className="row">
        {
          store.fieldsAssigned ?
            <NavTabs selected={store.selectedTab} onSelect={store.updateSelectedTab}>
              <Objective label="Objective" store={store} />
              <ConstraintList label="Constraints" store={store} />
              <FieldList label="Bounds & Types" store={store} />
            </NavTabs>
            :
            <SplashScreen />
        }
      </div>
    </div>
  );
}

Layout.propTypes = {
  store: P.object.isRequired,
};

export default observer(Layout);
