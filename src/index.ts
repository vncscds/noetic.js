import { defineStorage } from './storage';

// The storage module simplifies how to use IndexedDB
// It 'looks like' how you would use a MongoDB or mongoose, but more easier and for web specific purposes
// Use "defineStorage" to load the IndexedDB storage (indexeddb object stores)
export const storage = defineStorage([
  {
    collection: 'users',
    keyPath: 'id',
    autoIncrement: false
  },
] as const)

// Simple as that, you can now retrieve the collections (object stores)
const users = storage.collection('users')

// users.getAll().then(r => console.log(r))
// users.query().findOne().where('name').notEq('vini').then(r => console.log(r))
// users.query().findMany().where('name').notEq('vini').then(r => console.log(r))

// And use the collection methods
// users.insertOne({ id: 1, name: 'John Doe' })
// users.getAll().limit(16)
// users.insertMany([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }])