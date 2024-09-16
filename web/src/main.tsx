import React from 'react'
import ReactDOM from 'react-dom/client'
import { VisibilityProvider } from './providers/VisibilityProvider'
import { MantineProvider } from '@mantine/core'
import Welcome from './components/Welcome'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider  theme={{ colorScheme:'dark' }}>
        <VisibilityProvider componentName="Welcome">
          <Welcome/>
        </VisibilityProvider>
    </MantineProvider>
  </React.StrictMode>
)