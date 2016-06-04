import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import FieldListItem from './FieldListItem';

function FieldList({ store }) {
  return (
    <div className="list-group">
      {
        store.fieldStore.fields.map((field) => (
          <FieldListItem
            key={field.id}
            field={field}
            options={store.fieldStore.fieldTypes}
          />
        ))
      }
    </div>
  );
}

FieldList.propTypes = {
  store: P.object.isRequired,
};

export default observer(FieldList);
