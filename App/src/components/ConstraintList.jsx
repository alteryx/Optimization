import React from 'react';
import { observer } from 'mobx-react';

import ConstraintItem from './ConstraintItem';

function ConstraintList({ store }) {
  const cs = store.constraintStore;

  const handleAdd = () => {
    cs.addConstraint(store.editorValue);
    // store.update();
    store.updateEditor('');
  };

  const handleSave = () => {
    cs.currentConstraint.save(store.editorValue);
  };

  const handleRemove = (e, c) => {
    e.preventDefault();
    c.delete();
  };

  return (
    <div>
      <h3>This is the constraints component</h3>
      <button
        className="btn btn-default"
        onClick={store.saveOrAdd ? handleAdd : handleSave}
        disabled={store.isEditorEmpty}
      >
        {store.saveOrAdd ? <i className="fa fa-plus"></i> : <i className="fa fa-floppy-o"></i>}
      </button>
      <div className="list-group">
        {
          cs.constraints.map(c => (
              <ConstraintItem
                key={c.id}
                isBeingEdited={c.isBeingEdited}
                constraint={c}
                editConstraint={c.toggleEditing}
                removeConstraint={(e) => handleRemove(e, c)}
              />
            )
          )
        }
      </div>
    </div>
  );
}

ConstraintList.propTypes = {
  store: React.PropTypes.object,
};

export default observer(ConstraintList);
