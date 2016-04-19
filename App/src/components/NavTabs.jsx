import React, { PropTypes as P } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class NavTabs extends React.Component {
  static propTypes = {
    children: P.oneOfType([
      P.array,
      P.element,
    ]).isRequired,
  }
  @observable selected = 0;

  handleSelect = (e, idx) => {
    e.preventDefault();
    this.selected = idx;
  }

  renderTabs = () => (
    <ul className="nav nav-tabs">
      {
        this.props.children.map((child, idx) => {
          let isActive = (this.selected === idx ? 'active' : '');
          return (
            <li key={idx} className={isActive}>
              <a href="#" onClick={(e) => this.handleSelect(e, idx)}>
                {child.props.label}
              </a>
            </li>
          );
        })
      }
    </ul>
  )

  renderContent = () => (
    <div>
      {this.props.children[this.selected]}
    </div>
  );

  render() {
    return (
      <div>
        { this.renderTabs() }
        { this.renderContent() }
      </div>
    );
  }
}

export default NavTabs;
