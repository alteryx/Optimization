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

  updateEditor(value) {
    const { renderer } = Alteryx.Gui;
    renderer
      .getReactComponentByDataName('editorValue').editor
      .setValue(value);
  }
}

export default Store;
