import React from 'react';
import { observer } from 'mobx-react';

function SplashScreen() {
  return (
    <div className="panel panel-default">
      <div className="panel-body">
        <h4 className="text-center">
          Enter your decision variables as a comma-separated list in the textbox above and click the `+` button.
        </h4>
      </div>
    </div>
  );
}

export default observer(SplashScreen);
