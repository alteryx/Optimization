/*
  eslint new-cap: ["error",
    {"capIsNewExceptions":
      ["GetDataItem", "BindUserDataChanged", "AddDataItem"]
    }
  ]
*/

/* global $ Alteryx */

<<<<<<< HEAD
import $ from 'jquery';
import { createUIObject, makeDataItem, syncDataItems } from './Utils';
import VM from './Constants';
// import renderConstraintEditor from './RunView';
import runView from './RunView';
=======
// import $ from 'jquery';
import { createUIObject, makeDataItem, syncDataItems } from './components/Utils';
import VM from './components/Constants';
import renderConstraintEditor from './components/RunView';
>>>>>>> master


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

// Set the hintList prop of the code-editor widget to a data item instead of a string
const syncHintList = (ayx, editorName, hintListName) => {
  const { Gui: { manager, renderer } } = ayx;

  // Grab a reference to the editor widget
  const editor = renderer.getReactComponentByDataName(editorName).editor;

  // Override the default `hintList` prop by setting it to the value of the `hintListName` data item
  editor.options.hintList = manager.GetDataItem(hintListName).value.replace(/\s/g, '');

  // Bind an event handler to the `hintListName` data item for future changes
  manager.GetDataItem(hintListName).BindUserDataChanged((e) => {
    editor.options.hintList = e.replace(/\s/g, '');
    console.log(editor.options.hintList);
  });
};

Alteryx.Gui.BeforeLoad = (manager, AlteryxDataItems) => {
  const dataItem = makeDataItem(manager, AlteryxDataItems);

  // Initialize DataItem
  Object.keys(VM).forEach(d => dataItem(d, { values: VM[d] }));
  dataItem('activePage', { value: 'landing' });
  //dataItem('currentIndex', {value: 0})
  //dataItem('payload', { value: '{}' });


  // const varList = new AlteryxDataItems.MultiStringSelector(
  //   { id: 'varList', dataname: 'varList', value: ['x1', 'x2'] }
  // );
  // manager.AddDataItem(varList);

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
  syncHintList(Alteryx, 'FormulaFields', 'varList');
  // renderConstraintEditor(
  runView(
    Alteryx, {
      editorValue: 'FormulaFields',
      constraints: 'constraints',
      fieldNames: 'varList',
    }, 'constraint-editor'
  );
};

Alteryx.Gui.Annotation = (manager) => {
  const string = manager.GetDataItem('inputMode').getValue();
  return `${string.charAt(0).toUpperCase() + string.slice(1)} Input Mode`;
};
