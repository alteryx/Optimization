/*
  eslint new-cap: ["error",
    {"capIsNewExceptions": ["GetDataItemByDataName", "BindUserDataChanged"]}
  ]
*/

/* global $ Alteryx */

import AyxStore from './AyxStore';
import { extendObservable, observable, computed, autorun } from 'mobx'; //eslint-disable-line

class MobxStore extends AyxStore {
  @observable currentIndex = null;
  @observable bounds = [];
  @observable selectedField;

  constructor(ayx, dataItems) {
    const { Gui: { manager } } = ayx;
    // call the AyxStore constructor to set up the DataItem tracking
    super(manager, dataItems);

    // turn all the initial properties into observables
    extendObservable(this, this);

    this.selectedField = this.fieldNameArray[0];
  }

  @computed get numConstraints() {
    return this.constraints.length;
  }

  @computed get isEditorEmpty() {
    return this.editorValue === '';
  }

  @computed get saveOrAdd() {
    return this.currentIndex === null ? 'Add' : 'Save';
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

  // Specific to bounds-editor
  // @observable fieldNames = [];

  // fieldNames comes in as a comma-separated string, so we split to array in a computed property
  @computed get fieldNameArray() {
    return this.fieldNames.split(',').map(fieldName => fieldName.trim());
  }

  @computed get remainingFields() {
    // return this.fieldNames
    return this.fieldNameArray
      .filter(field => !this.bounds.map(bound => bound.field).includes(field));
  }

  updateSelectedField(v) {
    this.selectedField = v;
  }

  addBound(field) {
    this.bounds.push({
      field,
      lowerBound: 0,
      upperBound: null,
    });
    this.selectedField = this.remainingFields[0];
  }

  editBound(idx, newBound) {
    this.bounds[idx] = newBound;
  }

  deleteBound(idx) {
    this.bounds.splice(idx, 1);
    this.selectedField = this.remainingFields[0];
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
      .setValue((this.constraints.toJSON()));
  }
}

export default MobxStore;
