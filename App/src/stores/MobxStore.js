/*
  eslint new-cap: ["error",
    {"capIsNewExceptions": ["GetDataItemByDataName", "BindUserDataChanged"]}
  ]
*/

/* global $ Alteryx */

import { extendObservable, observable, computed, autorun } from 'mobx'; //eslint-disable-line
import AyxStore from './AyxStore';

class MobxStore extends AyxStore {
  constructor(ayx, dataItems) {
    const { Gui: { manager } } = ayx;
    // call the AyxStore constructor to set up the DataItem tracking
    super(manager, dataItems);

    // turn all the initial properties into observables
    extendObservable(this, this);
  }

  @observable currentIndex = null;

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
