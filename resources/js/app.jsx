import "../css/app.css"
import "./bootstrap"

import {createInertiaApp} from "@inertiajs/react"
import {resolvePageComponent} from "laravel-vite-plugin/inertia-helpers"
import {createRoot} from "react-dom/client"

import {Provider} from "@/Components/themes/ui/provider"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const appName = import.meta.env.VITE_APP_NAME || "Laravel"
const queryClient = new QueryClient()

function ReactQueryDevtools(props) {
    return null;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({el, App, props}) {
        const root = createRoot(el)

        root.render(
            <Provider>
                <QueryClientProvider client={queryClient}>
                    <App {...props} />
                    <ReactQueryDevtools initialIsOpen={false}/>
                </QueryClientProvider>
            </Provider>
        )
    },
    progress: {
        color: "#4B5563",
    },
})
