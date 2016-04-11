/*
  eslint new-cap: ["error",
    {"capIsNewExceptions": ["GetDataItemByDataName", "BindUserDataChanged"]}
  ]
*/

/* global $ Alteryx */

import { extendObservable, observable, computed, autorun } from 'mobx'; //eslint-disable-line

class AyxStore {
  // @param manager is an instance of Alteryx.Gui.manager
  // @param dataItems is an object where each key is the property name you'd like to use in the
  // store and the value is a string contraining that dataItem you're making into an observable
  constructor(manager, dataItems) {
    Object.keys(dataItems).forEach(i => {
      const item = manager.GetDataItemByDataName(dataItems[i]); // An Alteryx DataItem

      // assign each DataItem's value to its corresponding propName
      this[i] = item.value;

      // Bind a change handler to each dataItem and have it update the store on change
      item.BindUserDataChanged((v) => { this[i] = v; });
    });
  }
}

class MobxStore extends AyxStore {
  constructor(ayx, dataItems) {
    const { Gui: { manager } } = ayx;
    // call the AyxStore constructor to set up the DataItem tracking
    super(manager, dataItems);

    // turn all the initial properties into observables
    extendObservable(this, this);
  }

  //@observable constraints = Alteryx.Gui.manager.GetDataItem('constraints').getValue();
  //@observable constraints = [];
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
    const {manager, renderer} = Alteryx.Gui;
    renderer.getReactComponentByDataName('FormulaFields')
      .editor
      .setValue(this.editorValue);
    manager
      .GetDataItemByDataName('constraints')
      .setValue((this.constraints.toJSON()));
  }
}

export default MobxStore;
