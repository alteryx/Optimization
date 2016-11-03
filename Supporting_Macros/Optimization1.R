## DO NOT MODIFY: Auto Inserted by AlteryxRhelper ----
suppressWarnings(library(AlteryxPrescriptive))
# This option helps us detect whether we are running in an Alteryx workflow or not.
options(alteryx.inworkflow = '%Question.activePage%' != "" && inAlteryx()) 
config <- list(
  activePage = textInput('%Question.activePage%'),
  constraints = textInput(
    '%Question.constraints%'
    , '["3 x1 + 4 x2 + 2 x3 <= 60","2 x1 + x2 + 2 x3 <= 40","x1 + 3 x2 + 2 x3 <= 80"]'
  ),
  displayFieldMapO = checkboxInput('%Question.displayFieldMapO%' , FALSE),
  editorValue = textInput('%Question.editorValue%'),
  fieldList = textInput('%Question.fieldList%'),
  fieldNames = textInput('%Question.fieldNames%'),
  fileType = dropdownInput('%Question.fileType%' , 'CPLEX_LP'),
  inputMode = dropdownInput(
    '%Question.inputMode%' , 
    if (inAlteryx()) 'matrix' else 'file'
  ),
  maximize = checkboxInput('%Question.maximize%' , TRUE),
  
  `nameCoef` = dropdownInput('%Question.nameCoef%', "c"),
  `nameLower` = dropdownInput('%Question.nameLower%', "l"),
  `nameType` = dropdownInput('%Question.nameType%', "tt"),
  `nameUpper` = dropdownInput('%Question.nameUpper%', "u"),
  `nameVar` = dropdownInput('%Question.nameVar%', "v"),

  constraintMode = dropdownInput('%Question.constraintMode%', 'slam'),
  
  objective = textInput(
    '%Question.objective%' 
    , '2 x1 + 4 x2 + 3 x3'
  ),
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
# Throw error if file path is invalid
if (config$inputMode == 'file' && !file.exists(config$filePath)){
  stop.Alteryx('Invalid file path specified')
}

if (config$inputMode == 'manual'){
  if (config$objective == ""){
    stop.Alteryx("Please specify an objective function")
  }
  if (config$constraints == "[]"){
    stop.Alteryx("Please specify at least one constraint")
  }
}

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
  if (config$problemType != "QP"){
    readInputs("O", "A", "B")
  } else {
    readInputs("O", "A", "B", "Q") 
  }
} else {
  data.frame
}

# print(config)
# print('printing inputs')
# print(inputs)
payload <- list(config = config, inputs = inputs)

library(ROI)
# Solve Optimization Problem
out <- AlteryxSolve(payload)

## Outputs ---

# S Output: Simple Table
simpleOutput <- makeDataOutput(out, format = 'simple')
write.Alteryx(simpleOutput, 1)

# D Output: All Tables
dataOutput <- makeDataOutput(out, format = 'pipe')
write.Alteryx(dataOutput, 3)

## I Output: Interactive Dashboard ----
makeInteractiveReport(out, nOutput = 5)

if (out$status$code == 1){
  AlteryxMessage(out$status$msg$message, iType = 3, iPriority = 3)
}
