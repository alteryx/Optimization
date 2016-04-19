import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import FieldListItem from './FieldListItem';

function FieldList({ store }) {
  const handleAdd = (e) => {
    e.preventDefault();
    store.fieldNameArray.forEach(field => store.fieldStore.addField(field));
  };

  return (
    <div>
      <button className="btn btn-default" onClick={handleAdd}>
        <i className="fa fa-plus"></i>
      </button>
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
}

FieldList.propTypes = {
  store: P.object.isRequired,
};

export default observer(FieldList);
