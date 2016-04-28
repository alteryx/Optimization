## DO NOT MODIFY: Auto Inserted by AlteryxRhelper ----
library(AlteryxRhelper)
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
library(AlteryxPrescriptive)
library(AlteryxRviz)
iOutput <- function(s2a, varNames){
  if (is.null(varNames)){
    varNames = paste0("x", seq_along(s2a$solution))
  }
  d = data.frame(x = varNames, y = s2a$solution)
  p4 = c3(
    data = list(json = d, keys = list(x = 'x', value = list('y')), type = 'bar'),
    axis = list(
      rotated = TRUE,
      x = list(type = "category", tick = list(outer = list(show = FALSE))),
      y = list(label = '')
    ),
    grid = list(y = list(show = TRUE)),
    tooltip = list(show = FALSE),
    legend = list(show = FALSE),
    width = '100%',
    height = 300
  )

  objective_function = list(
    Solution = list(
      value = s2a$objval,
      title = 'Optimal Value',
      definition = "<p>This is the optimal value</p>"
    )
  )

  myNavBar <- Navbar2("Optimization",
    navList(navItem(icon('play'), 'Tour', href='#'))
  )
  app <- keen_dash(
    myNavBar,
    Row(
      infobox(objective_function, div = 'col-xs-12 col-md-4'),
      Panel(c(xs = 12, md = 8), p4, 'Optimal Solution', notes = 'Optimal Solution')
    )
  )
  renderInComposer(app, nOutput = 3)
}
s2a <- AlteryxSolve(payload)
iOutput(s2a, inputs$O$variable)
