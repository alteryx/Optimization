import React from 'react';
import { observer } from 'mobx-react';

function SplashScreen() {
  return (
    <div className="panel panel-default">
      <div className="panel-body">
        <p className="text-center panel-text">
          Enter variables as a comma-separated list in the text entry field above, then click Add to define the bounds and types.
        </p>
      </div>
    </div>
  );
}

export default observer(SplashScreen);
