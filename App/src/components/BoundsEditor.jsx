import React from 'react';
import { observer } from 'mobx-react';
import Select from './Select';
import BoundsList from './BoundsList';

function BoundsEditor({ store }) {
  // Update `selectedField` in the store
  const handleSelection = store.updateSelectedField.bind(store);

  // `selectedFilter` checks if a particular field has already been added as a bound and returns
  // a boolean. Used by the `Select` component to set `disabled` class per option.
  const selectedFilter = (field) => !store.remainingFields.includes(field);

  // Add the selected field to the store as a new bound
  const handleAdd = (e) => {
    e.preventDefault();
    store.addBound(store.selectedField);
  };

  return (
    <div>
      <div className="form-inline">
        <Select
          style={{ minWidth: 100 }}
          value={store.selectedField}
          disabledFilter={selectedFilter}
          options={store.fieldNameArray}
          onChange={handleSelection}
        />
        <button
          className="btn btn-primary"
          disabled={store.remainingFields.length === 0}
          onClick={handleAdd}
        >
          +
        </button>
      </div>
      <br />
      <BoundsList store={store} />
    </div>
  );
}

BoundsEditor.propTypes = {
  store: React.PropTypes.object.isRequired,
};

export default observer(BoundsEditor);
