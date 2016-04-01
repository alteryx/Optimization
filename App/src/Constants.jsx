const model = {
  solver: {
    glpk: 'Glpk',
    gurobi: 'Gurobi',
    symphony: 'Symphony',
    quadprog: 'QuadProg',
  },
  fileType: {
    CPLEX_LP: 'CPLEX_LP',
    MathProg: 'MathProg',
    MPS_Free: 'MPS_Free',
    MPS_Fixed: 'MPS_Fixed'
  },
  problemType: {
    LP: 'Linear Program',
    MIP: 'Mixed Integer Program',
    QP: 'Quadratic Program',
  },
  inputMode: {
    matrix: 'Specify the model as matrices',
    manual: 'Enter the model manually',
    file: 'Specify the model from a file',
  },
};

export default model;
