import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './shared/styles/globals.css'
import {RouterProvider} from "react-router-dom";
import {router} from "./app/router.tsx";
import {QueryProvider} from "./app/providers/QueryProvider.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryProvider>
            <RouterProvider router={router} />
        </QueryProvider>
    </StrictMode>
)
