# About the Optimization Tool

<img src="../OptimizationIcon.png" width=100 height=100 />



Optimization has wide applications in many industries, such as supply chain, transportation, financial service, retail, telecom, engery etc. Application examples include supply chain optimization, assortment optimization, portfolio optimization, workforce scheduling, sports scheduling and so on.

An optimization problem typically consists of an _objective function_, a set of _constraint inequlities_  and a specification of the types (continous, integer, binary) and bounds of _decision variables_.  The goal is usually to find the solution of the decision variables, such that the objective is maximized or minimized while all the constraints are satisfied. 

Alteryx Optimization tool currently supports 3 most common optimization problems: linear programming (LP), mixed integer linear programing (MILP) and quadratic programming (QP).  We offer 3 input modes: file, matrix and manual. File mode supports industry standard model file input, including CPLEX_LP, MathProg and MPS format. Users who generate her constraints and objective via other programs will find it easy to use matrix input mode that supports either dense or sparse([slam](https://cran.r-project.org/web/packages/slam/slam.pdf)) matrices. Manual input mode offers an interactive interface, where users can specify according objective and constraints directly. Sensitivity analysis is available for linear programing problems. 


_Note: This tool uses the R tool. Install R and the necessary packages by going to Options > Download Predictive Tools._

### Inputs

There are 4 inputs and all are optional

1. __O Input (optional)__ Use this to provide the objective function. It should have the following 5 columns:
- `variable`: a string, decision variable names;
- `coefficient`: a number, coefficient of each decision variable in objective function;
- `lb`: a number, lower bound of according decision variable;
- `ub`: a number, uppper bound of according decision variable;
- `type`: a character,  the type of according decision variable, which can be __C__ (continuous), __B__(binary, 0 and 1) and __I__ (integer)
2. __A Input (optional)__ Use this to provide the coefficients of the constraint matrix.
- SLAM matrix: requires 3 columns: `i`, `j`, `v`, where, `i`, `j` are row and column index respectively and `v` is the non-zero value of the matrix element
- Dense matri: columns are decision variable names, for example: `x`, `y`, `z`. Number of rows equal to number of constraints. __Note__: you can combine Input B with input A for dense matrix. Simply add the two columns from Input B to Input A.

  
3. __B Input (optional)__ Use this to provide the name, direction and right hand side of the constraints. It should have the following 2 columns:
- `dir`: a string, direction of the constraint inequality. It has to be `>=`, `<=` or `=`
- `rhs`: a number, the right hand side of the inequality. 
4. __Q Input (optional)__ Use this to provide the quadratic portion of the objective function, in the case of a Quadratic Programming problem.
- __SLAM matrix__: requires 3 columns: `i`, `j`, `v`, where, `i`, `j` are row and column index respectively and `v` is the non-zero value of the matrix element.
- __Dense matrix__: columns are decision variable names, for example: `x`, `y`, `z`. 

### Configuration Properties

1. __Select input mode:__ This option controls the mode of input. Currently supports matrix, manual and file inputs.
2. __Select problem type:__ We currently support:
-  __linear programming__ (LP): linear objective and linear constraints with __continuous__ decision variables;
- __mixed integer linear programming__ (MILP): linear objective and linear constraints with __bineary__ or __integer__ decision variables;
- __quadratic programming__ (QP): quadratic objective and linear constraints with __continous__ decision variables.
3. __Maximize Objective?:__ Is this a maximization problem?
4. __Select file type:__ We currently support CLPEX_LP, MathProg and MPS formats.
5. __Show sensitivity report:__ This option controls whether or not to carry out sensitivity analysis and display the results. If selected, solver is GLPK.
6. __Enter Decision Variables:__ A comma separated list of decision variable names
7. __Enter objective function:__ This is the objective function to be maximized or minimized

### Output

1. __I Output__ This output provides a dashboard of the solution.
