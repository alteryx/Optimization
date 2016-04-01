/*
  eslint new-cap: ["error",
    {"capIsNewExceptions":
      ["GetDataItem", "BindUserDataChanged", "AddDataItem"]
    }
  ]
*/

/* global $ Alteryx */

import $ from 'jquery';
import { createUIObject, makeDataItem, syncDataItems } from './Utils';
import VM from './Constants';
import renderConstraintEditor from './RunView';


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
  Object.keys(VM).forEach(d => dataItem(d, { values: VM[d] }));
  dataItem('activePage', { value: 'landing' });
  //dataItem('currentIndex', {value: 0})
  //dataItem('payload', { value: '{}' });


  const constraints = new AlteryxDataItems.MultiStringSelector(
    { id: 'constraints', dataname: 'constraints' }
  );
  manager.AddDataItem(constraints);
};

Alteryx.Gui.AfterLoad = (manager) => {
  controlPageDisplay(manager);
  syncSolverList(manager);
  syncDataItems(
    'payload',
    ['fileType', 'filePath', 'solver', 'inputMode', 'maximize', 'problemType']
  );
  renderConstraintEditor(
    Alteryx, {
      editorValue: 'FormulaFields',
      constraints: 'constraints',
      //currentIndex: 'currentIndex',
    }, 'constraint-editor'
  );
};

Alteryx.Gui.Annotation = (manager) => {
  const string = manager.GetDataItem('inputMode').getValue();
  return `${string.charAt(0).toUpperCase() + string.slice(1)} Input Mode`;
};