import React from 'react';
import { observer } from 'mobx-react';
import ConstraintItem from './ConstraintItem';
import Editor from './Editor';

function ConstraintList({ store }) {
  const cs = store.constraintStore;

  const handleAdd = (e) => {
    e.preventDefault();
    cs.addConstraint(store.editorValue);
  };

  const handleSave = (e) => {
    e.preventDefault();
    cs.currentConstraint.save(store.editorValue);
  };

  const handleChange = (v) => {
    store.updateEditor(v);
  };

  const handleRemove = (e, c) => {
    e.preventDefault();
    c.delete();
  };

  return (
    <div>
      <div className="input-group constraint-input">
        <Editor
          value={store.editorValue}
          hintList={store.fieldNameArray}
          onChange={handleChange}
        />
        <span className="input-group-btn">
          <button
            className="btn btn-sm btn-primary"
            onClick={store.saveOrAdd ? handleAdd : handleSave}
            disabled={store.isEditorEmpty}
          >
            {store.saveOrAdd ? <i className="fa fa-plus"></i> : <i className="fa fa-floppy-o"></i>}
          </button>
        </span>
      </div>
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
