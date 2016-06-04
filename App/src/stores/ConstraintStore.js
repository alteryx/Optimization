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
    this.store.editConstraint(this);
  }

  save(value) {
    this.value = value;
    this.store.saveConstraint();
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

  constructor(parentStore) {
    this.parentStore = parentStore;
  }

  addConstraint(value) {
    this.constraints.push(new Constraint(this, value));
    this.syncConstraints();
    this.parentStore.updateEditor('');
  }

  editConstraint(constraint) {
    this.currentConstraint = constraint;
    this.parentStore.updateEditor(this.currentConstraint.value);
  }

  saveConstraint() {
    this.currentConstraint = null;
    this.syncConstraints();
    this.parentStore.updateEditor('');
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
    this.parentStore.manager
      .GetDataItemByDataName('constraints')
      .setValue(JSON.stringify(this.asJSON));
  }
}

export default ConstraintStore;
