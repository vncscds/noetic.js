
export * from './object';

/**
  * @Storage
  * Init noetic storage
  */
import { getStorage } from './storage';
import type { TCollection } from './storage/@types';

type Movie = {
  id: string;
  name: string;
  rent_price: number;
}

// temp manual collections init
const collections: Array<TCollection<Movie, 'movies'>> = [
  {
    schema: 'movies',
    documents: [
      {
        id: 'rio',
        name: 'Rio',
        rent_price: 9.99
      }
    ]
  }
] as const

// init example
const coll = getStorage(collections).collection('movies')

// access to coll manipulation methods
coll.find
coll.findAsync
coll.isEmpty
coll.isUndefined
