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

print(config)

# #' Infer column names for Input O to "variable", "coefficient", "lb", "ub", "type"
# #' 
# #' @param O A data.frame, original O matrix from input Anchor O.
# #' @param displayFlag A boolean, if display field map for Input O in the UI.
# inferO <- function(O, displayFlag) {
#   r <- c("variable", "coefficient", "lb", "ub", "type")
#   names(r) <- config[c("nameVar", "nameCoef", "nameLower", "nameUpper", "nameType")]
#   if (displayFlag) {
#     O <- plyr::rename(O, r)
#   }
#   return(O)
# }
# 
# #' Infer column names for Input A based on constraintMode
# #' 
# #' @param A A data.frame, original A matrix from input Anchor A
# #' @param constrMode A string, constraint mode.
# inferA <- function(A, constrMode) {
#   if (constrMode == 'conInRow') {
#     constraint <- names(Filter(function(x){return(!isTRUE(x))}, 
#                                sapply(A, is.numeric)))
#     if (is.null(constraint) || length(constraint) == 0) {
#       stop("Error: lack of constraint column in Input A.")
#     } else if (length(constraint) > 1) {
#       stop("Error: there shouldn't be any other string type of columns except constraint.")
#     }
#     names(A)[names(A) == constraint] <- 'constraint'
#   }else if (constrMode == 'varInRow') {
#     variable <- names(Filter(function(x){return(!isTRUE(x))}, 
#                               sapply(A, is.numeric)))
#     if (is.null(variable) || length(variable) == 0) {
#       stop("Error: lack of variable column in Input A.")
#     } else if (length(variable) > 1) {
#       stop("Error: there shouldn't be any other string type of columns except variable.")
#     }
#     names(A)[names(A) == variable] <- 'variable'
#   }
#   return(A)
# }
# 
# #' Infer column names for Input B to 'constraint', 'rhs', 'dir'
# #' 
# #' @param B A data.frame, original B matrix from input Anchor B
# #' @examples 
# #' B <- data.frame(
# #' z = c('A', 'B', 'C'),
# #' x = c(">=", "<=", "=="),
# #' y = c(1, 2, 3)
# #' )
# #' inferB(B)
# inferB <- function(B) {
#   n = ncol(B)
#   # infer rhs
#   rhs <- names(Filter(isTRUE, sapply(B, is.numeric)))
#   if (is.null(rhs)) {
#     stop("Error: the rhs column should be of type numeric.")
#   }
#   
#   # infer dir
#   if (n > 3) {
#     stop("Error: Input B should only have constraint, dir, rhs columns")
#   } else if (n == 3) {
#     dir <- names(Filter(
#       function(x){all(x %in% c(">=", "<=", "==", ">", "<", "="))},
#       lapply(B[,names(B) != rhs], unique)
#     ))
#   } else if (n == 2) {
#     if (all(levels(B[, names(B) != rhs]) %in% c(">=", "<=", "==", ">", "<", "="))) {
#       dir <- names(B)[!(names(B) %in% rhs)]
#     }
#   } else {
#     stop("Error: Input B should at least dir and rhs columns")
#   }
#   if (is.null(dir)) {
#     stop("Error: the dir column should have >=, <=, ==, > or <.")
#   }
#   
#   # infer constraint
#   if (n == 3) {
#     constraint <- names(B)[!(names(B) %in% c(rhs, dir))]
#     repl <- c('constraint', 'rhs', 'dir')
#     names(repl) <- c(constraint, rhs, dir)
#   } else {
#     repl <- c('rhs', 'dir')
#     names(repl) <- c(rhs, dir)
#   }
#   
#   # Rename
#   plyr::rename(B, replace = repl)
# }
# 
# inputs$O <- inferO(inputs$O, config$displayFieldMapO) 
# inputs$B <- inferB(inputs$B)
# inputs$A <- inferA(inputs$A, config$constraintMode)

print('printing inputs')
print(inputs)
payload <- list(config = config, inputs = inputs)

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