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

    const { Gui: { manager } } = ayx;
    // call the AyxStore constructor to set up the DataItem tracking
    super(manager, dataItems);

    // turn all the initial properties into observables
    extendObservable(this, this);

    this.fieldStore = fieldStore;
    this.constraintStore = constraintStore;

    const fields = JSON.parse(this.fieldList);
    if (fields.length > 0) {
      this.fieldStore.fromJSON(fields);
    }

    const constraints = JSON.parse(this.constraints);
    if (constraints.length > 0) {
      this.constraintStore.fromJSON(constraints);
    }

    autorun(() => {
      if (this.constraintStore.currentConstraint === null) {
        this.updateEditor('');
      } else {
        this.updateEditor(this.constraintStore.currentConstraint.value);
      }
    });
  }

  @computed get isEditorEmpty() {
    return this.editorValue === '';
  }

  @computed get saveOrAdd() {
    return this.constraintStore.currentConstraint === null;
  }

  update() {
    this.editorValue = '';
    // this.updateAlteryxDataItems();
  }

  // editConstraint(c) {
  //   c.toggleEditing();
  //   this.editorValue = c.value;
  //   this.updateAlteryxDataItems();
  // }

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
      constraints: this.constraintStore.constraints.asJSON,
      fieldInfo: this.fieldStore.asJSON,
    };
  }

  updatePayload() {
    this.manualPayload = JSON.stringify(this.asJSON);
    Alteryx.Gui.manager.GetDataItemByDataName('manualPayload').setValue(this.manualPayload);
    console.log(Alteryx.Gui.manager.GetDataItemByDataName('manualPayload').value);
  }

  updateEditor(value) {
    const { renderer } = Alteryx.Gui;
    renderer
      .getReactComponentByDataName('editorValue').editor
      .setValue(value);
  }

  // since the update to the constraints array is triggered by mobx
  // we need to explicitly update the associated dataItem
  // this can also be automated in AyxStore
  updateAlteryxDataItems() {
    const { manager } = Alteryx.Gui;
    // const { manager, renderer } = Alteryx.Gui;
    // renderer.getReactComponentByDataName('FormulaFields')
    //   .editor
    //   .setValue(this.editorValue);
    manager
      .GetDataItemByDataName('constraints')
      .setValue(this.constraints.toJSON());
  }
}

export default Store;
