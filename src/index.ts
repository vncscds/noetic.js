import { defineStorage } from './storage';

export * from './object';

const storage = defineStorage([
  {
    collection: 'users',
    keyPath: 'id',
    autoIncrement: false
  },
])

storage.collection('users')
  .insertOne({ id: 32, name: 'Vinícius' })