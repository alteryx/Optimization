import AyxStore from './AyxStore';
import ConstraintStore from './ConstraintStore';
import { extendObservable, computed, observable } from 'mobx';

class Store extends AyxStore {
  // A method for re-instating the domain stores based on the serialized values received from
  // Alteryx's data items. If `rehydrate` detects that a data item actually has values, it will
  // rebuild the store from the snapshot using the stores `fromJSON` method.

  // @param stores: An array of object, where each object conforms to the following structure:
  // { storeName: string, dataItem: string }
  rehydrate(stores) {
    stores.forEach(({ storeName, dataItem }) => {
      const staticValues = JSON.parse(this[dataItem]);
      if (staticValues.length > 0) {
        this[storeName].fromJSON(staticValues);
      }
    });
  }

  @observable editorValue = '';

  constructor(ayx, dataItems, fieldStore) {
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
    this.constraintStore = new ConstraintStore(this.manager, this);

    // recreate the store from the snapshot stored in Alteryx's data items
    const stores = [
      { storeName: 'fieldStore', dataItem: 'fieldList' },
      { storeName: 'constraintStore', dataItem: 'constraints' },
    ];

    this.rehydrate(stores);
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
      // remove empty entries
      .filter(v => v.length > 0)
      // dedupe the array by comparing lowercase versions of existing array elements
      .reduce((acc, elem) => (acc.map(v => v.toLowerCase()).includes(elem.toLowerCase()) ?
        acc :
        acc.concat(elem)),
        []
      );
  }

  // Use property initializer so we don't have to use `this.bind(store)` when calling this method
  // from inside other components (Layout, specifically)
  updateSelectedTab = (selection) => {
    this.selectedTab = selection;
    this.manager.GetDataItemByDataName('selectedTab').setValue(this.selectedTab);
  }

  updateFieldNames(value) {
    this.fieldNames = value;
    this.manager.GetDataItemByDataName('fieldNames').setValue(this.fieldNames);
  }

  // Update both `this.objective` and the backing Alteryx data item with the value `v`
  updateObjective(value) {
    this.objective = value;
    this.manager.GetDataItemByDataName('objective').setValue(this.objective);
  }

  // Update the Alteryx code editor widget with the provided value
  updateEditor(value) {
    console.log(`updating editor to ${value}`);
    this.editorValue = value;
    // this.manager.GetDataItemByDataName('editorValue').setValue(this.editorValue);
  }
}

export default Store;
