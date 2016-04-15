### Backend

This repo contains the backend for the Optimization macro. This is designed to be developed using the `AlteryxRhelper` package, that extracts the R code from the macro into a separate `R` file and allows the macro and the R file to be synced with each other.

__Syncing R Code and Macro__

1. Run `extractRcode('Optimization.yxmc')` to extract R code from the macro.
2. Run `insertRcode('Optimization.yxmc', 'Optimization1.R')` to insert R code back into the macro.


__Automatically Write Configuration Code__

Running the code below

```r
AlteryxRhelper:::makeInput('Supporting_Macros/Optimization.yxmc', 'config')
```

will automatically generate R code to extract macro configuration in the R tool.

```
## DO NOT MODIFY: Auto Inserted by AlteryxRhelper ----
library(AlteryxRhelper)
config <- list(
  fileType = dropdownInput('%Question.fileType%' , 'CPLEX_LP'),
  inputMode = dropdownInput('%Question.inputMode%' , 'matrix'),
  maximize = checkboxInput('%Question.maximize%' , FALSE),
  payload = textInput('%Question.payload%'),
  problemType = dropdownInput('%Question.problemType%' , 'LP'),
  showSensitivity = checkboxInput('%Question.showSensitivity%' , FALSE),
  solver = dropdownInput('%Question.solver%' , 'glpk'),
  varList = textInput('%Question.varList%')
)
options(alteryx.wd = '%Engine.WorkflowDirectory%')
options(alteryx.debug = config$debug)
##----
```