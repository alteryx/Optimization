import React, { PropTypes as P } from 'react';
import { observable, toJSON } from 'mobx';
import { observer } from 'mobx-react';
import BoundItemView from './BoundItemView';
import BoundItemEdit from './BoundItemEdit';

@observer
class BoundItemContainer extends React.Component {
  static propTypes = {
    bound: P.object.isRequired,
    onDelete: P.func.isRequired,
    onEdit: P.func.isRequired,
  }

  @observable isEditing = false;

  toggleEditing = () => {
    this.isEditing = !this.isEditing;
  }

  handleSubmit = (e, tempBound) => {
    e.preventDefault();
    this.props.onEdit(tempBound);
    this.toggleEditing();
  }

  handleDelete = (e) => {
    e.stopPropagation();
    this.props.onDelete();
  }

  render() {
    if (this.isEditing) {
      const tempBound = toJSON(this.props.bound);
      return (
        <BoundItemEdit
          tempBound={tempBound}
          onCancel={this.toggleEditing}
          onSubmit={(e) => this.handleSubmit(e, tempBound)}
        />
      );
    }

    return (
      <BoundItemView
        bound={this.props.bound}
        onClick={this.toggleEditing}
        onDelete={this.handleDelete}
      />
    );
  }
}

export default BoundItemContainer;
