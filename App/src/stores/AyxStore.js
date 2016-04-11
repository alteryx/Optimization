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

export default AyxStore;
