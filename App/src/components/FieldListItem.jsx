import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import { observable, toJSON } from 'mobx';
// import BoundItemContainer from './BoundItemContainer';
import BoundItemEdit from './BoundItemEdit';
import BoundItemView from './BoundItemView';
import Select from './Select';

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
        <div className="col-xs-8">
          {/*Display bound information*/}
          <BoundItemView bound={this.props.field.bound} onClick={this.toggleEditing} />
        </div>
        <div className="col-xs-4 full-width">
          <div className="input-group">
            {/*Field type selection*/}
            <Select
              // style={{ width: 'auto' }}
              className="form-control"
              value={this.props.field.type}
              options={this.props.options}
              onChange={this.selectFieldType}
            />
            {/*The delete button*/}
            <span className="input-group-btn">
              <button
                type="button"
                className="btn btn-xs btn-transparent"
                onClick={this.handleDelete}
              >
                <i className="fa fa-trash text-danger"></i>
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

// function FieldListItem({ field, options }) {
//   const handleDelete = () => field.delete();
//   const handleEdit = (v) => field.update('bound', v);
//   const onSelect = (v) => field.update('type', v);
//
//   return (
//     <div className="list-group-item short-item">
//       <div className="row">
//         <div className="col-xs-8">
//           <BoundItemContainer
//             isEditing={this.isEditing}
//             bound={field.bound}
//             onDelete={handleDelete}
//             onEdit={handleEdit}
//           />
//         </div>
//         <div className="col-xs-4 full-width">
//           <div className="input-group">
//             <Select
//               // style={{ width: 'auto' }}
//               className="form-control"
//               value={field.type}
//               options={options}
//               onChange={onSelect}
//             />
//               <span className="input-group-btn">
//                 <button type="button" className="btn btn-xs btn-transparent" onClick={handleDelete}>
//                   <i className="fa fa-trash text-danger"></i>
//                 </button>
//               </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// FieldListItem.propTypes = {
//   field: P.object.isRequired,
//   options: P.array.isRequired,
// };
//
// export default observer(FieldListItem);
