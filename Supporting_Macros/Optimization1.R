## DO NOT MODIFY: Auto Inserted by AlteryxRhelper ----
options(alteryx.wd = '%Engine.WorkflowDirectory%')
library(AlteryxPrescriptive)
library(AlteryxRhelper)

## Configuration ----
config <- list(
  fileType = dropdownInput('%Question.fileType%' , 'CPLEX_LP'),
  filePath = textInput("%Question.filePath%", getSampleData("lp_example.lp")),
  inputMode = dropdownInput('%Question.inputMode%' , 'file'),
  maximize = checkboxInput('%Question.maximize%' , FALSE),
  payload = textInput('%Question.payload%'),
  problemType = dropdownInput('%Question.problemType%' , 'LP'),
  showSensitivity = checkboxInput('%Question.showSensitivity%' , FALSE),
  solver = dropdownInput('%Question.solver%' , 'glpk'),
  varList = textInput('%Question.varList%')
)

## Inputs ----
readInputs <- function(...){
  inputNames = c(...)
  streams = paste0('#', seq_along(inputNames))
  inputs <- setNames(lapply(streams, read.Alteryx), inputNames)
  Filter(function(d){NROW(d) > 0}, inputs)
}
inputs <- if (inAlteryx()) readInputs("O", "A", "B") else NULL
print(config)
payload <- list(config = config, inputs = inputs)

## Interactive Visualization ----

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
