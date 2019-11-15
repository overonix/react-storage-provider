import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LocalStorage from './LocalStorage';
import storageFactory from './storageFactory';

const STORAGE_KEY = '@storage';
const StorageContext = React.createContext();

class StorageProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    storage: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
      getItem: PropTypes.func.isRequired,
      setItem: PropTypes.func.isRequired,
    })]),
  };

  static defaultProps = {
    storage: 'localStorage',
  };

  constructor(props) {
    super(props);
    /**
     * Storage object with method provided to consumers
     * Need to prevent re-render child component which contain props shallow compare
     * That's why we save `storage` variable in constructor for generate only 1 reference on this object
     *
     * @type {*}
     */

    this.state = { [STORAGE_KEY]: {}, $STORAGE_READY: false };
    this.storage = {
      get: this.get,
      set: this.set,
      remove: this.remove,
    };
  }

  async componentDidMount() {
    this.providedStorage = await storageFactory(this.props.storage);

    // Load state from physical storage to memory
    const parsedStorage = await this.providedStorage.getItem(STORAGE_KEY);
    this.setState({ [STORAGE_KEY]: this._parseStorageData(parsedStorage), $STORAGE_READY: true });

    // Listen storage event and mutate memory state for cross-tab
    if (this.providedStorage instanceof LocalStorage) {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          const newValue = this._parseStorageData(e.newValue);
          const oldValue = this._parseStorageData(e.oldValue);

          // Set undefined to deleted key, because component will not update if key just removed from the state
          Object.keys(oldValue).forEach((key) => {
            if (!newValue[key]) {
              newValue[key] = undefined;
            }
          });

          this.setState({ [STORAGE_KEY]: newValue });
        }
      });
    }
  }

  /**
   * @private
   * Parse data from JSON
   *
   * @param data
   *
   * @return {*}
   */
  _parseStorageData = (data) => {
    try {
      // Because null parsed as null without error
      return JSON.parse(data) || {};
    } catch (e) {
      return {};
    }
  };


  /**
   * Get item from storage
   *
   * @return {string | *}
   */
  get = (key) => this.state[STORAGE_KEY][key];

  /**
   * Set item to storage
   *
   * @param key
   * @param value
   */
  set = (key, value) => {
    this.setState((state) => ({ [STORAGE_KEY]: { ...state[STORAGE_KEY], [key]: value } }), async () => {
      await this.providedStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    });
  };

  /**
   * Remove item from storage
   */
  remove = (key) => {
    const newState = { ...this.state[STORAGE_KEY], [key]: undefined };

    this.setState({ [STORAGE_KEY]: newState }, async () => {
      await this.providedStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    });
  };

  render() {
    const value = {
      state: this.state,
      storage: this.storage,
    };

    if (!this.state.$STORAGE_READY) return null;

    return (
      <StorageContext.Provider value={value}>
        {this.props.children}
      </StorageContext.Provider>
    );
  }
}

export const StorageConsumer = StorageContext.Consumer;

export const StoragePropTypes = {
  get: PropTypes.func.isRequired,
  set: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

export default StorageProvider;
