import React from 'react';
import { observer } from 'mobx-react';

import ConstraintItem from './ConstraintItem';

function ConstraintList({ store }) {
  const addConstraint = store.addConstraint.bind(store);
  const saveConstraint = store.saveConstraint.bind(store);

  return (
    <div>
      <button
        className="btn btn-default"
        onClick={store.currentIndex === null ? addConstraint : saveConstraint}
        disabled={store.isEditorEmpty}
      >
        {store.saveOrAdd ? <i className="fa fa-plus"></i> : <i className="fa fa-floppy-o"></i>}
      </button>
      <div className="list-group">
        {
          store.constraints.map((c, idx) => (
              <ConstraintItem
                key={idx}
                isBeingEdited={store.currentIndex === idx}
                constraint={c}
                editConstraint={() => store.editConstraint(idx)}
                removeConstraint={(e) => {e.preventDefault(); store.removeConstraint(idx);}}
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
