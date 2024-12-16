declare global {
    interface Window {
        bootstrap: typeof import('bootstrap'); // Import Bootstrap types
    }
}

export { };