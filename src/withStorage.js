import React from 'react';
import PropTypes from 'prop-types';
import { StorageConsumer, StoragePropTypes } from './StorageProvider';

/**
 * withStorage HOC to provide storage object with methods and subscribe to fields in storage
 *
 * Example:
 *
 * Provide `storage` object in component props:
 *
 * export default withStorage(SignIn);
 *
 * ==============================================
 *
 * Provide `storage` object and fields (with subscription) from storage to component props:
 *
 * export default withStorage([['token'])(SignIn);
 *
 * PROPS: { storage: { get, set, remove }, locale: 'ru' }
 *
 * @param keys {Array|Function} Can be array with fields keys to subscribe or React.Component
 *
 * @return {*}
 */
const withStorage = (keys) => {
  const hoc = (Component) => {
    const WrappedComponent = (props) => (
      <StorageConsumer>
        {({ storage }) => {
          // If keys argument provided as ReactComponent (without subscriptions on fields)
          if (!Array.isArray(keys)) {
            return <Component {...props} storage={storage} />;
          }

          const propsFromStorage = keys.reduce((acc, curr) => ({ ...acc, [curr]: storage.get(curr) }), {});

          return <Component {...props} {...propsFromStorage} storage={storage} />;
        }}
      </StorageConsumer>
    );

    WrappedComponent.displayName = `withStorage(${(Component.displayName || Component.name)})`;

    return WrappedComponent;
  };

  // Check if someone wants to get only storage object, without subscriptions on fields
  if (Array.isArray(keys)) {
    return hoc;
  }

  return hoc(keys);
};

withStorage.propTypes = {
  storage: PropTypes.shape(StoragePropTypes).isRequired,
};

export default withStorage;
