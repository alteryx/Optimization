/**
 * Create an object that can be passed to setStringList
 *
 * This function can accept an Array or an Object
 *
 * @param x
 * @return {Object} an object that can be passed to setStringList
 */
function createUIObject(x) {
  function a2ui(d) {
    return { uiobject: d, dataname: d };
  }
  function o2ui(d) {
    return { uiobject: x[d], dataname: d };
  }
  const f = (x.constructor === Array) ? a2ui : o2ui;
  const y = (x.constructor === Array) ? x : Object.keys(x);
  return y.map(f);
}

function makeDataItem(manager, AlteryxDataItems) {
  return function f(id, props, type = 'SimpleString') {
    let value;
    let dtype;
    if (props.values) {
      dtype = props.values.constructor === Array
        ? 'MultiStringSelector'
        : 'StringSelector';
    } else {
      dtype = type;
    }
    const di = manager.GetDataItem(id);
    const newItem = di || new AlteryxDataItems[dtype]({ id, dataname: id });
    if (dtype === 'StringSelector' || dtype === 'MultiStringSelector') {
      const data = createUIObject(props.values);
      newItem.setStringList(data);
      value = props.value ? props.value : data[0].dataname;
    } else {
      value = props.value;
    }
    manager.AddDataItem(newItem);
    if (value) newItem.setValue(value);
    return newItem;
  };
}

function syncDataItems(x, y) {
  const manager = window.Alteryx.Gui.manager;
  const xData = manager.GetDataItem(x);
  const yData = y.map(d => manager.GetDataItem(d));
  const xDataVal = {};
  function setVal() {
    y.forEach((k, i) => { xDataVal[k] = yData[i].getValue(); });
    xData.setValue(JSON.stringify(xDataVal));
    // console.log(xData.getValue());
  }
  yData.forEach((d) => d.BindUserDataChanged(setVal));
}

export { createUIObject, makeDataItem, syncDataItems };
