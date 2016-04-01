## DO NOT MODIFY: Auto Inserted by AlteryxRhelper ----
if (search('package:AlteryxRDataX' %in% search())){
  config <- list(
    inputMode = '%Question.inputMode%',
    problemType = '%Question.problemType%',
    solver = '%Question.solver%',
    maximize = '%Question.maximize%',
    formulaFields = '%Question.formulaFields%',
    fileType = '%Question.fileType%',
    filePath = '%Question.filePath%'
  )
  # update this to read only optional inputs which are provided by user
  # that data should be available in config, or can be inferred from
  # number of rows in the data frame
  inputs <- lapply(paste0('#', 1:3), read.Alteryx)
  payload <- list(config = config, inputs = inputs)
} else {
  # use this to read a payload directly from an R object.
  payload <- list()
}

options(alteryx.wd = '%Engine.WorkflowDirectory%')
options(alteryx.debug = config$debug)
##----
library(readQP)
library(ROI)
library(ROI.plugin.glpk)
library(ROI.plugin.quadprog)
library(slam)
#library(gurobi)

# Read matrix data from optional inputs
getMatrixData <- function(inputs){
  if (inputs$inputMode == "matrix"){
    idata = lapply(paste0('#', 1:3), read.Alteryx)
    names(idata) = c("O", "A", "B")
    if (inputs$problemType == "qp"){
      idata$Q = read.Alteryx("#4")
    }
  } else {
    idata = NULL
  }
  return(idata)
}


## Helper Functions ----
fixSlamMatrix <- function(m){
  if (is.simple_triplet_matrix(m)){
    ord = sort.int(m$j, index.return = TRUE)
    m$i = m$i[ord$ix]
    m$j = m$j[ord$ix]
    m$v = m$v[ord$ix]
    return(m)
  } else {
    return(m)
  }
}



processData <- function(idata){
  nrow = NROW(idata$O)
  if (identical(names(idata$A)[1:3], c('i', 'j', 'v'))){
    idata$A <- as.list(idata$A)
    idata$A$nrow = max(idata$A$i)
    idata$A$ncol = NROW(idata$O)
    idata$A <-  structure(idata$A, class = 'simple_triplet_matrix')
    idata$A <- fixSlamMatrix(idata$A)
  } else {
    idata$A = as.matrix(idata$A)
  }
  lb <- rep(0, nrow)
  if ('lb' %in% names(idata$O)){
    lb[!is.na(idata$O$lb)] = idata$O$lb[!is.na(idata$O$lb)]
  }
  idata$O$lb = lb
  
  ub <- rep(Inf, nrow)
  if ('ub' %in% names(idata$O)){
    ub[!is.na(idata$O$ub)] = idata$O$ub[!is.na(idata$O$ub)]
  }
  idata$O$ub = ub
  
  idata$B$dir = as.character(idata$B$dir)
  idata$O$type = as.character(idata$O$type)
  return(idata)
}


getBounds_matrix <- function(idata){
  li = 1:NROW(idata$O)
  ui = 1:NROW(idata$O)
  lb = ifelse(idata$O$lb, idata$O$lb, 0)
  ub = ifelse(idata$O$ub, idata$O$ub, Inf)
  nobj <- max(li, ui)
  bounds <- V_bound(li = li, ui = ui, lb = lb, ub = ub, nobj = nobj)
  # Need to treat bounds very carefully. V_bound strips default bounds which are
  # 0 for lower and Inf for upper. As a result it will return a list, with zero
  # bounds. But ROI_solve requires bounds to be NULL if it is expected to use 
  # defaults.
  if ((length(bounds$lower$ind) == 0) && (length(bounds$upper$ind) == 0)){
    bounds <- NULL
  }
  return(bounds)
}

# Get Bounds from Object -----
getBounds <- function(mod){
  li <- mod$bounds$lower$ind
  ui <- mod$bounds$upper$ind
  lb <- mod$bounds$lower$val
  ub <- mod$bounds$upper$val
  # we force evaluation of nobj due to lazy evaluation error in V_bound
  nobj <- max(li, ui)
  bounds <- V_bound(li = li, ui = ui, lb = lb, ub = ub, nobj = nobj)
  # Need to treat bounds very carefully. V_bound strips default bounds which are
  # 0 for lower and Inf for upper. As a result it will return a list, with zero
  # bounds. But ROI_solve requires bounds to be NULL if it is expected to use 
  # defaults.
  if ((length(bounds$lower$ind) == 0) && (length(bounds$upper$ind) == 0)){
    bounds <- NULL
  }
  return(bounds)
}

getBounds_gurobi <- function(mod){
  li <- mod$bounds$lower$ind
  ui <- mod$bounds$upper$ind
  lb <- mod$bounds$lower$val
  ub <- mod$bounds$upper$val
  # we force evaluation of nobj due to lazy evaluation error in V_bound
  if (is.null(li) && is.null(ui)){
    return(list(lb = NULL, ub = NULL))
  } else {
    nobj <- max(li, ui)
    lb_ <- rep(0, nobj)
    if (!is.null(li)){
      lb_[li] <- lb
    }
    
    ub_ <- rep(Inf, nobj)
    if (!is.null(ui)){
      ub_[ui] <- ub
    }
    list(lb = lb_, ub = ub_)
  }
}


#' Generic function.
#' 
#' Returns an object of class OP that is supported by the ROI class
constructModel <- function(x, ...){
  UseMethod("constructModel")
}


# Construct model file -----
constructModel.file_mode <- function(x, ...){
  mod <- readModelFile(x$filePath, type = x$fileType)
  constraints <- do.call(L_constraint, mod$constraints)
  if ("Q" %in% names(mod$objective)){
    objective = Q_objective(Q = mod$objective$Q, L = as.vector(mod$objective$c))
  } else {
    objective = L_objective(as.vector(mod$objective))
  }
  OP(
    objective = objective,
    constraints = constraints,
    types = mod$types,
    bounds = getBounds(mod),
    maximum = mod$maximum
  )
}

# If the manual input UI creates a temp file in the CPLEX_LP format, and returns a path to it
constructModel.manual_mode <- constructModel.file_mode

# If the manual input UI returns a string instead of a temp file path
constructModel.manual <- function(x, type = "CPLEX_LP", ...){
  tf <- tempfile(fileext = '.txt')
  cat(x, file = tf)
  construct_model.file(tf, type = type)
}


constructModel.matrix_mode <- function(x, ...){
  idata <- processData(x$idata)
  if ("Q" %in% names(idata)){
    objective = Q_objective(Q = idata$Q, L = idata$O$coefficient)
  } else {
    objective = idata$O$coefficient
  }
  constraints = L_constraint(
    L = idata$A,
    dir = idata$B$dir,
    rhs = idata$B$rhs
  )
  OP(
    objective = objective,
    constraints = constraints,
    types = idata$O$type,
    bounds = getBounds_matrix(idata),
    maximum = x$maximize
  )
}


# Solve Model -----
ROI_solve_gurobi <- function(lp){
  bounds <- getBounds_gurobi(lp)
  Q_ <- terms(objective(lp))$Q
  model <- list(
    modelsense = if (lp$maximum) "max" else "min",
    obj = as.vector(terms(objective(lp))$L),
    Q = if (is.null(Q_)) NULL else Q_/2,
    A = as.matrix(constraints(lp)$L),
    rhs = constraints(lp)$rhs,
    sense = constraints(lp)$dir,
    vtype = types(lp),
    lb = bounds$lb,
    ub = bounds$ub
  )
  soln <- gurobi(model)
}

solveModel <- function(x, solver = 'glpk'){
  if (solver == 'gurobi'){
    ROI_solve_gurobi(x)
  } else {
    ROI_solve(x, solver = solver)
  }
}


# Payload is a list consisting of Q and idata
makeAlteryxPayload <- function(){
	inputs <- '%Question.payload%'  
  # these are defaults
	if (inputs == ""){
	  Q <- list(
	    inputMode = "matrix",
	    problemType = "lp",
	    maximize = TRUE,
	    solver = "glpk"
	  )
	} else {
	  Q <- jsonlite::fromJSON(inputs)
	}

  idata <- getMatrixData(Q)
  x = append(Q, list(idata = idata))
  class(x) = c(
    class(x), 
    paste0(x$inputMode, "_mode")
  )
  return(x)
}


# Construct and Solve the Model
constructAndSolve <- function(x){
  mod <- constructModel(x)
  sol <- solveModel(mod, solver = x$solver)
  print("Solutions is: ")
  print(sol)
  return(sol)
}

x <- makeAlteryxPayload()
s2a <- constructAndSolve(x)


library(AlteryxRviz)
iOutput <- function(s2a){
  d = data.frame(x = paste0("X", 1:length(s2a$solution)), y = s2a$solution)
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
      definition = "<p>This is the optimal value of the objective function</p>"
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

#write.Alteryx(c(html = "hello"), 3)
iOutput(s2a)
