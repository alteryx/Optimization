<img src="OptimizationIcon.png" width=48 height=48></img> 

This repo contains the **Optimization** tool in Alteryx. Shown below is a brief description of the contents. 

| File                            | Description                                  |
|---------------------------------|----------------------------------------------|
| OptimizationConfig.xml      | Configuration for plugin (auto generated)    |  
| OptimizationGui.html        | Gui for plugin (auto generated)              |  
| OptimizationIcon.png        | Icon for plugin                              |  
| app.min.js                      | Script to interactively manipulate Gui.html  |
| app.css                         | Custom style sheet for Gui.html              |
| Macros/                         | Macro backend                                |
| Extras/                         | Gui, Tests, Samples and Help                 |             

#### Development

Use branches to work on features and bug fixes. Commit often. Send a PR to the upstream repo to merge your changes back in. Make sure to sync your clone with the upstream repo before sending a PR, so that merge conflicts are avoided.

The `source` files that will be modified directly include

1. Macros/Optimization.yxmc (backend)
2. Macros/Optimization1.R   (backend)
3. Extras/Gui/overrides.yaml    (gui)
4. Extras/Gui/layout.html       (gui)
5. Extras/Gui/App/src/*         (gui)

Whenever you manipulate one of these source files, you can run the `createPluginFromMacro()` function shown below to update the plugin and then run `copyHtmlPlugin` to install it in Alteryx. Make sure that your working directory is the plugin directory and also remember to set `options(alterx.path = <path to alteryx directory>)`  before the install.

```r
library(AlteryxRhelper)
options(alteryx.path = <path to alteryx>)
createPluginFromMacro()
copyHtmlPlugin()
```

### Build Javascript Files

To build the javascript files, run the following code from the root directory of the plugin.

```r
withr::with_dir("Extras/App", system('npm run build-umd'))
file.copy('Extras/App/dist/src.js', 'app.min.js', overwrite = TRUE)
updateHtmlPlugin()
```

