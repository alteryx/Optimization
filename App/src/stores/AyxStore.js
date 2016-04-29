class AyxStore {
  // @param manager is an instance of Alteryx.Gui.manager
  // @param dataItems is an object where each key is the property name you'd like to use in the
  // store and the value is a string contraining that dataItem you're making into an observable
  // constructor(manager, dataItems) {
  constructor(ayx, dataItems) {
    const { Gui: { manager, renderer } } = ayx;
    this.manager = manager;
    this.renderer = renderer;

    Object.keys(dataItems).forEach(i => {
      const item = this.manager.GetDataItemByDataName(dataItems[i]); // An Alteryx DataItem

      // assign each DataItem's value to its corresponding propName
      this[i] = item.value;

      // Bind a change handler to each dataItem and have it update the store on change
      item.BindUserDataChanged((v) => { this[i] = v; });
    });
  }
}

export default AyxStore;
