export const IS_TESTNET = process.env.NEXT_PUBLIC_IS_TESTNET == "true" ? true : false;
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (IS_TESTNET ? "https://testnet-data.rbx.network/api" : "https://data.rbx.network/api");
export const SOCKET_HOST = process.env.NEXT_SOCKET_HOST || "https://web-6616-56d67ef0-xroythiw.onporter.run/";
// export const API_BASE_URL = "http://127.0.0.1:8000/api";



export const MAINTENENCE_MODE = process.env.NEXT_PUBLIC_MAINTENENCE_MODE == "true" ? true : false;
