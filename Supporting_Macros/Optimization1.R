## DO NOT MODIFY: Auto Inserted by AlteryxRhelper ----
library(AlteryxPrescriptive)
config <- list(
  activePage = textInput('%Question.activePage%'),
  constraints = textInput(
    '%Question.constraints%' , 
    '["3 x1 + 4 x2 + 2 x3 <= 60","2 x1 + x2 + 2 x3 <= 40","x1 + 3 x2 + 2 x3 <= 80"]'
  ),
  editorValue = textInput('%Question.editorValue%'),
  fieldList = textInput('%Question.fieldList%'),
  fieldNames = textInput('%Question.fieldNames%'),
  fileType = dropdownInput('%Question.fileType%' , 'CPLEX_LP'),
  inputMode = dropdownInput('%Question.inputMode%' , if (inAlteryx()) 'matrix' else 'file'),
  maximize = checkboxInput('%Question.maximize%' , TRUE),
  objective = textInput('%Question.objective%' , '2 x1 + 4 x2 + 3 x3'),
  payload = textInput('%Question.payload%'),
  problemType = dropdownInput('%Question.problemType%' , 'LP'),
  selectedTab = textInput('%Question.selectedTab%'),
  showSensitivity = checkboxInput('%Question.showSensitivity%' , FALSE),
  solver = dropdownInput('%Question.solver%' , 'glpk')
)
options(alteryx.wd = '%Engine.WorkflowDirectory%')
options(alteryx.debug = config$debug)
##----

# Update configuration ----
config$filePath = textInput(
  '%Question.filePath%', 
  AlteryxPrescriptive::getSampleData("lp_example.lp")
)
config$constraints = jsonlite::fromJSON(config$constraints)
if (config$fieldList != "") {
  config$fieldList = jsonlite::fromJSON(config$fieldList, simplifyDataFrame = FALSE)
}

## Inputs ----
readInputs <- function(...){
  inputNames = c(...)
  streams = paste0('#', seq_along(inputNames))
  inputs <- setNames(lapply(streams, read.Alteryx), inputNames)
  Filter(function(d){NROW(d) > 0}, inputs)
}
# TOFIX: think through the condition to read inputs
inputs <- if (inAlteryx()) {
  if (config$problemType == "LP"){
    readInputs("O", "A", "B")
  } else {
    readInputs("O", "A", "B", "Q") 
  }
} else {
  NULL
}

print(config)
payload <- list(config = config, inputs = inputs)

## Interactive Visualization ----
out <- AlteryxSolve(payload)
renderInComposer(makeInteractiveReport(out), nOutput = 3)
