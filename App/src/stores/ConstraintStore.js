import { observable, computed } from 'mobx';
import uuid from 'node-uuid';

class Constraint {
  @observable value;
  @computed get isBeingEdited() {
    return this.store.currentConstraint === this;
  }

  constructor(store, value) {
    this.id = uuid.v4();
    this.store = store;
    this.value = value;
  }

  toggleEditing = () => {
    this.store.currentConstraint = this;
  }

  save(value) {
    this.value = value;
    this.store.currentConstraint = null;
    this.store.syncConstraints();
  }

  delete() {
    this.store.removeConstraint(this);
  }

  @computed get asJSON() {
    return this.value;
  }
}

class ConstraintStore {
  @observable constraints = [];
  @observable currentConstraint = null;

  constructor({ Gui: { manager } }) {
    this.manager = manager;
  }

  addConstraint(value) {
    this.constraints.push(new Constraint(this, value));
    this.syncConstraints();
  }

  removeConstraint(constraint) {
    if (this.currentConstraint === constraint) {
      this.currentConstraint = null;
    }
    this.constraints.splice(this.constraints.indexOf(constraint), 1);
    this.syncConstraints();
  }

  @computed get asJSON() {
    return this.constraints.map(c => c.asJSON);
  }

  fromJSON(payload) {
    payload.forEach(item => {
      this.addConstraint(item);
    });
  }

  syncConstraints() {
    this.manager.GetDataItemByDataName('constraints').setValue(JSON.stringify(this.asJSON));
  }
}

export default ConstraintStore;
