// import $ from 'jquery';
import { createUIObject, makeDataItem, syncDataItems } from './Utils';
// import VM from './Constants';
import runView from './RunView';

const controlPageDisplay = (manager) => {
  const activePage = manager.GetDataItem('activePage');
  $('fieldset').hide();
  $(`#${activePage.value}`).show();
  const page = manager.GetDataItem('inputMode');
  $(`#page-${page.value}`).show();
  manager
    .GetDataItem('inputMode')
    .BindUserDataChanged((v) => {
      $('.page').hide();
      $(`#page-${v}`).slideDown('slow');
    });
};



const syncSolverList = (manager) => {
  const solverList = {
    All: {glpk: 'Glpk', symphony: 'Symphony', quadprog: 'Quadprog'},
    LP: {glpk: "Glpk", symphony: "Symphony"},
    MIP: {glpk: "Glpk", symphony: "Symphony"},
    QP: {quadprog: "Quadprog"}
  }
  const solver = manager.GetDataItem('solver')
  const inputMode = manager.GetDataItem('inputMode')
  const setSolverList = () => {
    const pType = manager.GetDataItem('problemType').getValue();
    if (inputMode.getValue() == "file"){
      solver.setStringList(createUIObject(solverList.All))
    } else if (pType == "QP"){
      if (Object.keys(solverList.QP).indexOf(solver.value) < 0){
        solver.setValue("quadprog")
      }
      solver.setStringList(createUIObject(solverList.QP))
    } else {
      if (Object.keys(solverList.LP).indexOf(solver.value) < 0){
        solver.setValue("glpk")
      }
      solver.setStringList(createUIObject(solverList.LP))
    }
  }
  const problemType = manager.GetDataItem('problemType');
  setSolverList();
  problemType.BindUserDataChanged(setSolverList);
  inputMode.BindUserDataChanged(setSolverList);
};

Alteryx.Gui.BeforeLoad = (manager, AlteryxDataItems) => {
  const dataItem = makeDataItem(manager, AlteryxDataItems);

  // Initialize DataItem
  //Object.keys(VM).forEach(d => dataItem(d, { values: VM[d] }));
  dataItem('activePage', { value: 'landing' });
  // Create data items for manual input
  dataItem('fieldNames', { value: '' });
  dataItem('objective', { value: '' });
  dataItem('constraints', { value: '[]' });
  dataItem('fieldList', { value: '[]' });
  dataItem('selectedTab', { value: 0 }, 'SimpleFloat');
};

Alteryx.Gui.AfterLoad = (manager) => {
  controlPageDisplay(manager);
  console.log('Displaying Field Map O')
  displayTarget('field-map-O', 'displayFieldMapO')
  syncSolverList(manager);
  syncDataItems(
    'payload',
    ['fileType', 'filePath', 'solver', 'inputMode', 'maximize', 'problemType']
  );

  runView(
    Alteryx, {
      constraints: 'constraints',
      objective: 'objective',
      fieldNames: 'fieldNames',
      fieldList: 'fieldList',
      selectedTab: 'selectedTab',
    }, 'manual-input'
  );
};

Alteryx.Gui.Annotation = (manager) => {
  const string = manager.GetDataItem('inputMode').getValue();
  return `${string.charAt(0).toUpperCase() + string.slice(1)} Input Mode`;
};

function displayTarget(targetId, di, cond, resize = false){
  let condition;
  if (typeof cond == 'undefined'){
    condition = function(v){return v}
  } else if (typeof cond == 'string'){
    condition = function(v){return v === cond}
  } else {
    condition = cond;
  }
  const dataItem = Alteryx.Gui.manager.GetDataItemByDataName(di)
  const targetDiv = document.getElementById(targetId)
  function display(v){
    targetDiv.style.display = condition(v) ? 'block' : 'none'
    console.log("Resizing ", v)
    window.dispatchEvent(new Event('resize'));
  }
  dataItem.BindUserDataChanged(display)
  display(dataItem.value)
}
