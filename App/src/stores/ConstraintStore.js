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
  }

  delete() {
    this.store.removeConstraint(this);
  }
}

class ConstraintStore {
  @observable constraints = [];
  @observable currentConstraint = null;

  addConstraint(value) {
    this.constraints.push(new Constraint(this, value));
  }

  removeConstraint(constraint) {
    if (this.currentConstraint === constraint) {
      this.currentConstraint = null;
    }
    this.constraints.splice(this.constraints.indexOf(constraint), 1);
  }
}

export default ConstraintStore;
