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

const iconImages = {
  save: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEtJREFUeNpi0ff3/89AAWBB5lzYsIGRGE0GAQFwS5kYKASjBlDBABZc0TNEvUAoRWLzIhO+5EpMmNDGCyRkrIWMFGTnhUBLEgACDABMYRcyTRXdFQAAAABJRU5ErkJggg==',
  trash: 'data:image/svg+xml;base64,PHN2ZyBpZD0iZmY4NTc0MDQtOGNhOC00OGZhLWI2MWItYjgxOGQ3Y2I2YTEzIiBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDguMzggOC4zOCI+PGRlZnM+PHN0eWxlPi5cMzYgMjhmMGNlZC1mYzU4LTQ3YzMtOWEyMi1jN2QzYjc3NWNkYmV7ZmlsbDojMzE0YzRhO2ZpbGwtcnVsZTpldmVub2RkO308L3N0eWxlPjwvZGVmcz48dGl0bGU+ZGVsZXRlX3JvdzwvdGl0bGU+PHBhdGggY2xhc3M9IjYyOGYwY2VkLWZjNTgtNDdjMy05YTIyLWM3ZDNiNzc1Y2RiZSIgZD0iTTguMTksNy4xOWwtMy0zLDMtMywwLDBoMGEwLjcsMC43LDAsMCwwLTEtMWgwbC0zLDMtMy0zaDBhMC43LDAuNywwLDAsMC0xLDFoMGwzLDMtMywzaDBhMC43LDAuNywwLDAsMCwxLDFoMGwwLDAsMy0zLDMsM2gwYTAuNywwLjcsMCwwLDAsMS0xaDBaIi8+PC9zdmc+',
  undo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANRJREFUeNpi/P//PwMlgImBQsCCS8IgIKABSCUAsTyS8EMgXnBhw4YGmAAjyAtAxSDBBKhGASB1AIj18Vh8EYgdgHo+wLwQDzIEyt6ApHkjEAcCsSOU3ggV14daAncBLCQPArE9lF0ItGECFq+BXDofym1ENwDuV6BmBTzhA3KlP0gdrliYQCDwYd6Vx2VAA9AWAzwGfCCUDvhBgQQ0BJc3BFDSAdC/jCSmnwRYWDGSmpSBrgoAUuthscBCRuqFhc1FUIokx4AF0EBcAE9IA5obAQIMACMHSSSR0h5VAAAAAElFTkSuQmCC',
};


export { createUIObject, makeDataItem, syncDataItems, iconImages };
