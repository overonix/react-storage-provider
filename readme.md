### Providing The Storage
First we need to make the storage available to our app. To do this, we wrap our app with the `<StorageProvider />` . It has `storage` prop, that by default is localStorage.
If you wanna use sessionStorage or asyncStorage in react native you should pass it
`<StorageProvider storage={asyncStorage} />`

### Connecting the Components
React Storage Provider provides a `withStorage` function for you to read and write values from the store.

Example: 
`export default withStorage(SignIn);`
 Provides `storage` object in component props.
 
`export default withStorage([['token'])(SignIn);`
 Provides `storage` object and fields (with subscription) from storage to component props.

