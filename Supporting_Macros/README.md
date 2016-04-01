### Backend

This repo contains the backend for the Optimization macro. This is designed to be developed using the `AlteryxRhelper` package, that extracts the R code from the macro into a separate `R` file and allows the macro and the R file to be synced with each other.

__Syncing R Code and Macro__

1. Run `extractRcode('Optimization.yxmc')` to extract R code from the macro.
2. Run `insertRcode('Optimization.yxmc', 'Optimization1.R')` to insert R code back into the macro.


__Automatically Write Configuration Code__

The `extractConfig` function uses `../docs/ui.yaml` to extract configuration directly into the R code. This makes it simpler to keep the macro in sync with the UI.

```r
extractConfig <- function(uiFile){
  ui <- yaml::yaml.load_file(uiFile)
  d <- names(ui)
  x <- paste(sprintf("%s = '%%Question.%s%%'", d, d), collapse = ",\n  ")
  sprintf("config <- list(\n  %s\n)", x)
}
```
