/*
  eslint new-cap: ["error",
    {"capIsNewExceptions": ["GetDataItemByDataName", "BindUserDataChanged"]}
  ]
*/

/* global $ Alteryx */

import AyxStore from './AyxStore';
import { extendObservable, computed, autorun } from 'mobx';

class Store extends AyxStore {
  constructor(ayx, dataItems, fieldStore, constraintStore) {
    // The following properties are created from Alteryx:
    // - editorValue: '',
    // - objective: '',
    // - constraints: [],
    // - fieldNames: [],
    // - fieldList: [],

    // call the AyxStore constructor to set up DataItem tracking and manager/renderer references
    super(ayx, dataItems);

    // turn all the initial properties into observables
    extendObservable(this, this);

    this.fieldStore = fieldStore;
    this.constraintStore = constraintStore;

    // recreate the store from the snapshot stored in Alteryx's data items
    const stores = [
      { storeName: 'fieldStore', dataItem: 'fieldList' },
      { storeName: 'constraintStore', dataItem: 'constraints' },
    ];
    this.rehydrate(stores);

    // Automatically update the editor in response to state changes in the constraint store.
    autorun(() => {
      if (this.constraintStore.currentConstraint === null) {
        this.updateEditor('');
      } else {
        this.updateEditor(this.constraintStore.currentConstraint.value);
      }
    });
  }

  /* Store Methods */
  @computed get isEditorEmpty() {
    return this.editorValue === '';
  }

  // Determine whether or not the constraint in the the code editor should update an existing
  // constraint or create a new one
  @computed get saveOrAdd() {
    return this.constraintStore.currentConstraint === null;
  }

  // Dynamically convert the fieldNames string into a deduped array of unique values
  @computed get fieldNameArray() {
    return this.fieldNames.split(',')
      .map(fieldName => fieldName.trim())
      .reduce((acc, elem) => (acc.map(v => v.toLowerCase()).includes(elem.toLowerCase()) ?
        acc :
        acc.concat(elem)),
        []
      );
  }

  // Update both `this.objective` and the backing Alteryx data item with the value `v`
  updateObjective(v) {
    this.objective = v;
    this.manager.GetDataItemByDataName('objective').setValue(this.objective);
  }

  // Update the Alteryx code editor widget with the provided value
  updateEditor(value) {
    this.renderer
      .getReactComponentByDataName('editorValue').editor
      .setValue(value);
  }
}

export default Store;
