# React Storage Provider
React Storage Provider binds your storage with react. By default it uses localStorage, also you can use asyncStorage with React Native.

# Installation
```
npm install --save react-storage-provider
```
# How to use?

### Providing The Storage
First we need to make the storage available to our app. To do this, we wrap our app with the `<StorageProvider />` . It has `storage` prop, that by default is localStorage.
If you wanna use sessionStorage or asyncStorage in react native you should pass it
`<StorageProvider storage={asyncStorage} />`

### Connecting the Components
React Storage Provider provides a `withStorage` function for you to read and write values from the store.

#### Get storage object to props examples: 
```
export default withStorage(Component);
```
 Provides `storage` object in `Component` props.
 `storage` prop has methods: `get, set, remove` for manipulation with storage.
 
 `get(key)` - returns `key` value from storage
 
 `set(key, value)` - sets `value` for `key` in storage
 
 `remove(key)` - sets `key` value to `undefined`

#### Get storage values to props examples: 
```
export default withStorage(['token', 'locale'])(SignIn);
```
Provides `token, locale` values from storage to component props.

