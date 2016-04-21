## Optimization Plugin

This repo contains files for the Optimization Tool in Alteryx.

<img src="OptimizationIcon.png" width=48 height=48></img> 

This repo contains the **Optimization** tool. Shown below is a brief description of the contents. 

| File                                 | Description                                       |
|--------------------------------------|---------------------------------------------------| 
| OptimizationConfig.xml               | Configuration for plugin (auto generated)         |
| OptimizationGui.html                 | Gui for plugin (auto generated)                   |
| OptimizationIcon.png                 | Icon for plugin                                   |
| app.min.js                           | Script to interactively manipulate Gui.html       |
| app.css                              | Custom style sheet for Gui.html                   |
| Gui/overrides.yaml                   | Configuration to override widget properties       |
| Gui/layout.html                      | Layout for organizing widgets in Gui.html         |
| Supporting_Macros/Optimization.yxmc  | Macro backend                                     |
| Supporting_Macros/Optimization1.R    | R code for the macro                              |
| App/                                 | Source files for app.min.js                       |


### Installation

1. Download https://github.com/alteryx/optimization/archive/master.zip.
2. Rename `Optimization-master.zip` to `Optimization.yxi`.
3. Open in Alteryx to complete installation.

### Development

Clone this repo using RStudio or the command line. Use branches to work on features and bug fixes. Commit often. Send a PR to the upstream repo to merge your changes back in. Make sure to sync your clone with the upstream repo before sending a PR, so that merge conflicts are avoided.

The `source` files that will be modified directly include

1. Supporting_Macros/Optimization.yxmc (backend)
2. Supporting_Macros/Optimization1.R   (backend)
3. Gui/overrides.yaml                  (gui)
4. Gui/layout.html                     (gui)
5. App/src/*                           (gui)

Whenever you manipulate one of these source files, you can run the `buildPlugin()` function shown below to update the plugin and install it in Alteryx. Make sure to set `options(alterx.path = <path to alteryx directory>)`  before running the build.

```r
library(AlteryxRhelper)
options(alteryx.path = <path to alteryx>)
buildPlugin()
```

### Build Javascript Files

To build the javascript files, run the following code from the root directory of the plugin.

```r
withr::with_dir("App", system('npm run build-umd'))
file.copy('App/dist/src.js', 'app.min.js', overwrite = TRUE)
updateHtmlPlugin()
```

