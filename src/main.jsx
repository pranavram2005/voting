import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import SimpleJsonViewer from './SimpleDataViewer'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimpleJsonViewer />
  </React.StrictMode>
)
