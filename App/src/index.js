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
  const setSolverList = (pType) => {
    const solver = manager.GetDataItem('solver');
    if (pType === 'QP') {
      solver.setValue('quadprog');
      solver.setStringList(
        createUIObject({
          quadprog: 'Quadprog',
          gurobi: 'Gurobi',
        })
      );
    } else {
      solver.setValue('glpk');
      solver.setStringList(
        createUIObject({
          glpk: 'Glpk',
          gurobi: 'Gurobi',
          symphony: 'Symphony',
        })
      );
    }
  };
  const problemType = manager.GetDataItem('problemType');
  setSolverList(problemType.getValue());
  problemType.BindUserDataChanged(setSolverList);
};

Alteryx.Gui.BeforeLoad = (manager, AlteryxDataItems) => {
  const dataItem = makeDataItem(manager, AlteryxDataItems);

  // Initialize DataItem
  //Object.keys(VM).forEach(d => dataItem(d, { values: VM[d] }));
  dataItem('editorValue', { value: '' });
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
  syncSolverList(manager);
  syncDataItems(
    'payload',
    ['fileType', 'filePath', 'solver', 'inputMode', 'maximize', 'problemType']
  );

  runView(
    Alteryx, {
      editorValue: 'editorValue',
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
