import { observable, computed, extendObservable, autorun, transaction } from 'mobx';
import uuid from 'node-uuid';

class Field {
  @observable fieldName;
  @observable type;
  @observable bound = {};

  constructor(store, fieldName, type, lowerBound, upperBound) {
    this.store = store;
    this.fieldName = fieldName;
    this.id = uuid.v4();
    this.type = type;

    extendObservable(this.bound, {
      field: fieldName,
      lowerBound,
      upperBound,
    });

    // Automatically set the bound range to (0, 1) if the type is set to 'Binary'
    autorun(() => {
      if (this.type === 'Binary') {
        transaction(() => {
          this.bound.lowerBound = 0;
          this.bound.upperBound = 1;
        });
      }
    });
  }

  update(prop, value) {
    this[prop] = value;
    this.store.syncFields();
  }

  delete() {
    this.store.deleteField(this);
  }

  @computed get asJSON() {
    return {
      fieldName: this.fieldName,
      type: this.type,
      lowerBound: this.bound.lowerBound,
      upperBound: this.bound.upperBound,
    };
  }
}

class FieldStore {
  // Integer === General
  fieldTypes = ['Continuous', 'Binary', 'Integer'];
  @observable fields = [];

  constructor(parentStore) {
    this.parentStore = parentStore;
  }

  addField(name, type = 'Continuous', lowerBound = 0, upperBound = '+inf') {
    // only add a field if `name` was provided
    if (name) {
      // Check if a field with the given name already exists
      if (this.fields.every(field => field.fieldName !== name)) {
        this.fields.push(
          new Field(this, name, type, lowerBound, upperBound)
        );
      }
      this.syncFields();
    }
  }

  deleteField(field) {
    this.fields.splice(this.fields.indexOf(field), 1);
    this.syncFields();
  }

  @computed get asJSON() {
    return this.fields.map(field => field.asJSON);
  }

  fromJSON(payload) {
    payload.forEach(item => {
      this.addField(item.fieldName, item.type, item.lowerBound, item.upperBound);
    });
  }

  syncFields() {
    this.parentStore.manager
      .GetDataItemByDataName('fieldList')
      .setValue(JSON.stringify(this.asJSON));
  }
}

export default FieldStore;
