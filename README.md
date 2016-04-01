## Optimization Plugin

This repo contains files for the Optimization Tool in Alteryx.


## Installation

1. Download https://github.com/alteryx/test-optim/archive/master.zip.
2. Rename `.zip` to `.yxi`.
3. Open in Alteryx to complete installation.

## Development

> The whole app is developed in ES6. So you would need the appropriate tools (node, npm, nwb) to develop.

1. Update files in `nwb/src`.
2. Run `updateHtmlPlugin("Optimization")`. Make sure to update the arguments `fromRoot` and `toRoot` based on your setup. This function builds the application to `umd/app.min.js`, copies it over to the root directory, and installs the plugin to `Alteryx/bin`. Unless you have modified `OptimizationConfig.xml`, you would not need to restart Alteryx.

```r
updateHtmlPlugin <- function(pluginName, 
    fromRoot = '~/Desktop/SNIPPETS/dev/',
    toRoot = '/Volumes/C/Program Files/Alteryx/bin/'){
  from = file.path(fromRoot, pluginName)
  with_dir <- function (new, code){
    old <- setwd(dir = new)
    on.exit(setwd(old))
    force(code)
  }
  
  cwd = getwd(); setwd(from); on.exit(setwd(cwd));
  from = "."
  with_dir('nwb', system("nwb build-umd"))
  to = file.path(toRoot, 'HtmlPlugins', pluginName)
  if (!(file.exists(to))) {
    dir.create(to, recursive = TRUE)
  }
  file.copy(file.path(from, 'App', 'umd', 'app.min.js'), from, overwrite = TRUE)
  files = list.files(from, full.names = T, recursive = TRUE)
  files = files[!grepl('Supporting_Macros|App|docs', files)]
  file.copy(files, to, recursive = TRUE)

  # Copy Supporting Macro
  supporting_macro <- list.files(file.path(from, 'Supporting_Macros'))
  if (length(supporting_macro) > 0){
    file.copy(
      supporting_macro,
      file.path(toRoot, 'RuntimeData', 'Macros', 'Supporting_Macros')
    )
  }
}
```
