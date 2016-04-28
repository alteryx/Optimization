import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import FieldListItem from './FieldListItem';

function FieldList({ store }) {
  const renderEmpty = () => (
    <div>
      <h4>Enter some fields in the text box above and click the `+` button</h4>
    </div>
  );

  const renderList = () => (
    <div>
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
    </div>
  );

  return store.fieldStore.fields.length === 0 ? renderEmpty() : renderList();
}

FieldList.propTypes = {
  store: P.object.isRequired,
};

export default observer(FieldList);
