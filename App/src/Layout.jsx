import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import ConstraintList from './components/ConstraintList';
import FieldList from './components/FieldList';
import Objective from './components/Objective';
import NavTabs from './components/NavTabs';

function Layout({ store }) {
  const handleInputChange = (e) => {
    e.preventDefault();
    store.updateFieldNames(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        className="form-control input-sm"
        value={store.fieldNames}
        onChange={handleInputChange}
      />
      <NavTabs selected={store.selectedTab} onSelect={store.updateSelectedTab}>
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
