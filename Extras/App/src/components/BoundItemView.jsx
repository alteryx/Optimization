import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';

function BoundItemView({ bound, onClick }) {
  const showUpperBound = () => (bound.upperBound ? `<= ${bound.upperBound}` : '');
  return (
    <div className="bound-item-view" onClick={onClick}>
      <h5 style={{ marginTop: 5, marginBottom: 5 }}>{bound.lowerBound} &lt;= {bound.field} { showUpperBound() }</h5>
    </div>
  );
}

BoundItemView.propTypes = {
  bound: P.object.isRequired,
  onClick: P.func.isRequired,
};

export default observer(BoundItemView);
