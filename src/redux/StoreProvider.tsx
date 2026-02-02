'use client'
import Provider from '@/Provider'
import { store } from './store'
import React from 'react'

function StoreProvider({children}:{children:React.ReactNode}) {
  return (
    
      <Provider store={store}>
        {children};
        </Provider>
     
    
  )
}

export default StoreProvider
