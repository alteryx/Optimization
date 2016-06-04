import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import { observable, toJSON } from 'mobx';
import BoundItemEdit from './BoundItemEdit';
import BoundItemView from './BoundItemView';
import Select from './Select';
import { iconImages } from '../Utils';

@observer
class FieldListItem extends React.Component {
  static propTypes = {
    field: P.object.isRequired,
    options: P.array.isRequired,
  }

  // Track the editing state of each individual field list item locally since we want
  // to render editing vs. viewing components
  @observable isEditing = false;

  toggleEditing = () => { this.isEditing = !this.isEditing; };

  // Send bound edits up to the backing Field instance in the FieldStore
  handleSubmit = (e, tempBound) => {
    e.preventDefault();
    this.props.field.update('bound', tempBound);
    this.toggleEditing();
  }

  // Send deletions up to the backing Field instance in the FieldStore
  handleDelete = (e) => {
    e.stopPropagation();
    this.props.field.delete();
  }

  // Update the field type on the backing Field instance. This is used in the Select component
  // inside renderView
  selectFieldType = (v) => this.props.field.update('type', v);

  // A render function for the "view" mode of a FieldListItem. Displays both the Bound info and the
  // field type selection
  renderView() {
    return (
      <div className="row">
        <div className="col-xs-7">
          {/*Display bound information*/}
          <BoundItemView bound={this.props.field.bound} onClick={this.toggleEditing} />
        </div>
        <div className="col-xs-5 full-width">
          <div className="input-group">
            {/*Field type selection*/}
            <Select
              className="form-control"
              value={this.props.field.type}
              options={this.props.options}
              onChange={this.selectFieldType}
            />
            {/*The delete button*/}
            <span className="input-group-btn" style={{ paddingLeft: 5, paddingRight: 5 }}>
              <button
                type="button"
                className="smallButton btn-transparent"
                onClick={this.handleDelete}
              >
                <img style={{ width: 12, height: 12 }} src={iconImages.trash} />
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // A render function for displaying the "edit" mode. In this mode, we hide the field type
  // selection and only render the BoundItemEdit component since the bound will be edited in a
  // temp state anyway (plus it gives us more space to work with)
  renderEdit() {
    const tempBound = toJSON(this.props.field.bound);
    return (
      <div className="row">
        <div className="col-xs-12">
          <BoundItemEdit
            tempBound={tempBound}
            onCancel={this.toggleEditing}
            onSubmit={e => this.handleSubmit(e, tempBound)}
          />
        </div>
      </div>
    );
  }

  // The main render function. Simply wraps the content in list-group-item and then calls the
  // appropriate render method based on the state of isEditing
  render() {
    return (
      <div className="list-group-item short-item">
        {
          this.isEditing ? this.renderEdit() : this.renderView()
        }
      </div>
    );
  }
}

export default FieldListItem;
