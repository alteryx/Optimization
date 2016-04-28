import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import FieldNameInput from './components/FieldNameInput';
import ConstraintList from './components/ConstraintList';
import FieldList from './components/FieldList';
import Objective from './components/Objective';
import NavTabs from './components/NavTabs';

function Layout({ store }) {
  return (
        <FieldNameInput store={store} />
    </div>
  );
}

Layout.propTypes = {
  store: P.object.isRequired,
};

export default observer(Layout);
