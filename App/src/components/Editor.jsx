import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import ReactCodeMirror from 'react-codemirror';
import CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint.js';

@observer
class Editor extends React.Component {
  static propTypes = {
    value: P.string.isRequired,
    hintList: P.array.isRequired,
    onChange: P.func.isRequired,
  }

  componentDidMount() {
    CodeMirror.defineMode('simple-highlighting', () => ({
      token: (stream, /* state */) => {
        stream.eatWhile(/[a-zA-Z\d]/);
        if (this.props.hintList.includes(stream.current())) {
          stream.next();
          return 'style1';
        }
        stream.next();
        return null;
      },
    }));

    CodeMirror.registerHelper('hint', 'simpleHints', (cm, /* options */) => {
      const cur = cm.getCursor();
      const token = cm.getTokenAt(cur);

      const results = {
        list: cm.options.hintList,
        from: CodeMirror.Pos(cur.line, token.start),
        to: CodeMirror.Pos(cur.line, token.end),
      };

      CodeMirror.signal(cm, 'hasCompletion', cm, results, token);

      return results;
    });

    CodeMirror.commands.autocomplete = (cm) => {
      CodeMirror.showHint(cm, CodeMirror.hint.simpleHints);
    };
  }

  render() {
    const options = {
      mode: 'simple-highlighting',
      scrollbarStyle: 'null',
      hint: CodeMirror.hint.simpleHints,
      readOnly: false,
      extraKeys: { 'Ctrl-Space': 'autocomplete' },
      hintList: this.props.hintList,
    };

    return (
      <ReactCodeMirror
        ref="editor"
        value={this.props.value}
        onChange={this.props.onChange}
        options={options}
      />
    );
  }
}

export default Editor;