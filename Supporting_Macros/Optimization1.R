## DO NOT MODIFY: Auto Inserted by AlteryxRhelper ----
inMacro = '%Question.payload%' == ""
library(AlteryxPrescriptive)
if ('package:AlteryxRDataX' %in% search() && !inMacro){
  config <-  jsonlite::fromJSON('%Question.payload%')
  # update this to read only optional inputs which are provided by user
  # that data should be available in config, or can be inferred from
  # number of rows in the data frame
  readInputs <- function(...){
    inputNames = c(...)
    streams = paste0('#', seq_along(inputNames))
    inputs <- setNames(lapply(streams, read.Alteryx), inputNames)
    Filter(function(d){NROW(d) > 0}, inputs)
  }

  inputs <- readInputs("O", "A", "B")

} else {
  # use this to read a payload directly from an R object.
  config <- list(
    inputMode = "file",
    fileType = "CPLEX_LP",
    problemType = "lp",
    maximize = TRUE,
    solver = "glpk",
    filePath = getSampleData("cell_tower.lp")
  )
  inputs <- NULL
}
payload <- list(config = config, inputs = inputs)

options(alteryx.wd = '%Engine.WorkflowDirectory%')
options(alteryx.debug = config$debug)
##----

saveRDS(inputs, '%Engine.WorkflowDirectory%inputs.rds')
saveRDS(payload, '%Engine.WorkflowDirectory%payload.rds')
saveRDS('%Question.payload%', '%Engine.WorkflowDirectory%raw_payload.rds')

library(AlteryxRviz)
iOutput <- function(s2a, varNames){
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
