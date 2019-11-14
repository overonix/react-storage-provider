import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const STORAGE_KEY = '@storage';
const StorageContext = React.createContext();

class StorageProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    providedStorage: PropTypes.shape({
      getItem: PropTypes.func.isRequired,
      setItem: PropTypes.func.isRequired,
    }),
    async: PropTypes.bool,
  };

  static defaultProps = {
    providedStorage: window.localStorage,
    async: false,
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
    this.storage = {
      get: this.get,
      set: this.set,
      remove: this.remove,
    };
  }

  async componentDidMount() {
    const { providedStorage, async } = this.props;
    // Load state from physical storage to memory
    this.state = this._parseStorageData(await providedStorage.getItem(STORAGE_KEY));

    // Listen storage event and mutate memory state for cross-tab
    if (!async) {
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

          this.setState(newValue);
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
  get = (key) => this.state[key];

  /**
   * Set item to storage
   *
   * @param key
   * @param value
   */
  set = (key, value) => {
    const { providedStorage } = this.props;
    this.setState({ [key]: value }, async () => {
      await providedStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    });
  };

  /**
   * Remove item from storage
   */
  remove = (key) => {
    const { providedStorage } = this.props;
    const newState = { ...this.state, [key]: undefined };

    this.setState(newState, async () => {
      await providedStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    });
  };

  render() {
    const value = {
      state: this.state,
      storage: this.storage,
    };

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
