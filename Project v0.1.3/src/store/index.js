import { observable, computed, action, decorate, runInAction } from "mobx";
import { get, set, entries, remove } from "mobx";
import * as firebaseService from "./firebaseService";

export class Store {
  constructor() {
    this.activeUser = null;
    this.loading = false;
    this.authCheckComplete = false;
    this.items = new Map();
    this.initializationError = null;
    this.initializeStore().then(u => {
      this.activeUser = u;
      this.authCheckComplete = true;
    });
  }

  /** @param {*} _authUser */
  handleAuthedUser = async _authUser => {
    if(_authUser) {
      let userAcctInfo = await firebaseService.getUserProfile();
      console.log("setting active user");
      this.activeUser = { ..._authUser, ...userAcctInfo };
    }else{
      this.activeUser = _authUser;
    }
    return this.activeUser;
  };

  async initializeStore() {
    return firebaseService.authCheck(this.handleAuthedUser).then(_user => {
        return _user;
    }).catch(e => {
        return runInAction(() => {
          this.initializationError = e;
        });
      });
  }

  get doCheckAuth() {
    if (firebaseService.getCurrentUser()) {
      return this.activeUser;
    } else {
      return null;
    }
  }
  get authenticatedUser() {
    return this.activeUser || null;
  }
  get itemEntries() {
    return entries(this.items);
  }

  /**
   * get a specific item based on its key
   * @param {*} _key
   */
  itemByKey(_key) {
    return get(this.items, _key);
  }

  doLogin(_username, _password) {
    debugger;
    if (_username.length) {
      return firebaseService.loginWithEmail(_username, _password).then(
          _result => {
            return true;
          },
          err => {
            console.log(err);
            return err;
          }
        )
        .catch(e => {
          console.log(e);
          return e;
        });
    }
  }

  async doCreateUser(_params) {
    try {
      let newUser = await firebaseService.registerUser({
        email: _params.email,
        password: _params.password,
        firstName: _params.firstName,
        lastName: _params.lastName
      });
      return newUser;
    } catch (err) {
      debugger;
      console.log(err);
      return err;
    }
  }

  doLogout() {
    this.activeUser = null;
    return firebaseService.logOut();
  }

  loadData() {
    return firebaseService.queryObjectCollection({ collection: "items" }).then(
        _result => {
          // create the user object based on the data retrieved...
          return runInAction(() => {
            let resultMap = _result.reduce((map, obj) => {
              map[obj.id] = obj;
              return map;
            }, {});
            this.items = resultMap;
            return resultMap;
          });
        },
        err => {
          console.log(err);
          return err;
        }
      )
      .catch(e => {
        console.log(e);
        return e;
      });
  }
  addItem(_data) {
    return firebaseService
      .addObjectToCollection({ collection: "items", objectData: _data })
      .then(
        _result => {
          // create the user object based on the data retrieved...
          return runInAction(() => {
            set(this.items, _result.id, _result);
            return _result;
          });
        },
        err => {
          console.log(err);
          return err;
        }
      )
      .catch(e => {
        console.log(e);
        return e;
      });
  }

  deleteItem(_data) {
    return firebaseService
      .removeObjectFromCollection({ collection: "items", objectId: _data.id })
      .then(
        _result => {
          // create the user object based on the data retrieved...
          return runInAction(() => {
            remove(this.items, _data.id);
            return true;
          });
        },
        err => {
          console.log(err);
          return err;
        }
      )
      .catch(e => {
        console.log(e);
        return e;
      });
  }
}

decorate(Store, {
  // OBSERVABLES
  activeUser: observable,
  loading: observable,
  authCheckComplete: observable,
  items: observable,
  initializationError: observable,

  // COMPUTED
  authenticatedUser: computed,
  doCheckAuth: computed,
  itemEntries: computed,

  // ACTIONS
  doCreateUser: action,
  doLogin: action,
  doLogout: action,
  loadData: action,
  itemByKey: action,
  addItem: action,
  deleteItem: action
});