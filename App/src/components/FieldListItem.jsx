import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import BoundItemContainer from './BoundItemContainer';
import Select from './Select';

function FieldListItem({ field, options }) {
  const handleDelete = () => field.delete();
  const handleEdit = (v) => field.update('bound', v);
  const onSelect = (v) => field.update('type', v);

  return (
    <div className="list-group-item">
      <div className="row">
        <div className="col-xs-8">
          <BoundItemContainer
            bound={field.bound}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
        <div className="col-xs-3">
          <Select
            style={{ width: 'auto' }}
            value={field.type}
            options={options}
            onChange={onSelect}
          />
        </div>
        <div className="col-xs-1" style={{ marginTop: 5 }}>
          <a href="#" className="pull-right" onClick={handleDelete}>
            <span className="fa fa-trash fa-lg text-danger"></span>
          </a>
        </div>
      </div>
    </div>
  );
}

FieldListItem.propTypes = {
  field: P.object.isRequired,
  options: P.array.isRequired,
};

export default observer(FieldListItem);
