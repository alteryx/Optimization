import React, { PropTypes as P } from 'react';
import { observer } from 'mobx-react';
import ReactCodeMirror from 'react-codemirror';
import CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/display/placeholder.js';

@observer
class Editor extends React.Component {
  static propTypes = {
    value: P.string.isRequired,
    hintList: P.array.isRequired,
    onChange: P.func.isRequired,
    onSubmit: P.func,
  }

  componentWillMount() {
    CodeMirror.defineMode('simple-highlighting', () => ({
      token: (stream, /* state */) => {
        if (this.props.hintList.length > 0) {
          const keywordPattern = new RegExp(this.props.hintList.map(v => `${v}\\b`).join('|'));
          if (stream.match(keywordPattern)) {
            return 'highlight-keyword';
          }
          stream.next();
          return null;
        }
        // If the hint list is empty, just advance the stream without any checks
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

  componentDidMount() {
    // If we find that there is data returning from the Alteryx backend, then force the edtior to
    // to load the value rather than deferring to the placeholder.
    if (this.props.value) {
      this.refs.editor.getCodeMirror().setValue(this.props.value);
    }
  }

  handleSubmit = () => {
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  render() {
    const options = {
      mode: 'simple-highlighting',
      scrollbarStyle: 'null',
      viewportMargin: Infinity,
      lineWrapping: true,
      hint: CodeMirror.hint.simpleHints,
      readOnly: false,
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        Enter: this.handleSubmit,
      },
      hintList: this.props.hintList,
    };

    return (
      <ReactCodeMirror
        ref="editor"
        value={this.props.value}
        placeholder="Ctrl + Space for suggestions"
        onChange={this.props.onChange}
        options={options}
      />
    );
  }
}

export default Editor;
