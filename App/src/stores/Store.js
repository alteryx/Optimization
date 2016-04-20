/*
  eslint new-cap: ["error",
    {"capIsNewExceptions": ["GetDataItemByDataName", "BindUserDataChanged"]}
  ]
*/

/* global $ Alteryx */

import AyxStore from './AyxStore';
import { extendObservable, observable, computed } from 'mobx';

class Store extends AyxStore {
  @observable currentIndex = null;

  constructor(ayx, dataItems, fieldStore) {
    // The following properties are created from Alteryx:
    // - editorValue: '',
    // - objective: '',
    // - constraints: [],
    // - fieldNames: [],
    // - fieldList: [],

    const { Gui: { manager } } = ayx;
    // call the AyxStore constructor to set up the DataItem tracking
    super(manager, dataItems);

    // turn all the initial properties into observables
    extendObservable(this, this);

    this.fieldStore = fieldStore;

    const fields = JSON.parse(this.fieldList);
    if (fields.length > 0) {
      this.fieldStore.fromJSON(fields);
    }
  }

  @computed get numConstraints() {
    return this.constraints.length;
  }

  @computed get isEditorEmpty() {
    return this.editorValue === '';
  }

  @computed get saveOrAdd() {
    return this.currentIndex === null;
  }

  update() {
    this.editorValue = '';
    this.currentIndex = null;
    this.updateAlteryxDataItems();
  }

  addConstraint() {
    this.currentIndex = this.numConstraints;
    this.saveConstraint();
  }

  saveConstraint() {
    this.constraints[this.currentIndex] = this.editorValue;
    this.update();
  }

  editConstraint(idx) {
    this.currentIndex = idx;
    this.editorValue = this.constraints[this.currentIndex];
    this.updateAlteryxDataItems();
  }

  removeConstraint(idx) {
    this.constraints.splice(idx, 1);
    this.update();
  }

  updateObjective(v) {
    this.objective = v;
    Alteryx.Gui.manager.GetDataItemByDataName('objective').setValue(this.objective);
  }

  @computed get fieldNameArray() {
    return this.fieldNames.split(',')
      .map(fieldName => fieldName.trim())
      .reduce((acc, elem) => (acc.map(v => v.toLowerCase()).includes(elem.toLowerCase()) ?
        acc :
        acc.concat(elem)),
        []
      );
  }

  @computed get asJSON() {
    return {
      objective: this.objective,
      constraints: this.constraints.toJSON(),
      fieldInfo: this.fieldStore.asJSON,
    };
  }

  updatePayload() {
    this.manualPayload = JSON.stringify(this.asJSON);
    Alteryx.Gui.manager.GetDataItemByDataName('manualPayload').setValue(this.manualPayload);
    console.log(Alteryx.Gui.manager.GetDataItemByDataName('manualPayload').value);
  }

  // since the update to the constraints array is triggered by mobx
  // we need to explicitly update the associated dataItem
  // this can also be automated in AyxStore
  updateAlteryxDataItems() {
    const { manager, renderer } = Alteryx.Gui;
    renderer.getReactComponentByDataName('FormulaFields')
      .editor
      .setValue(this.editorValue);
    manager
      .GetDataItemByDataName('constraints')
      .setValue(this.constraints.toJSON());
  }
}

export default Store;
