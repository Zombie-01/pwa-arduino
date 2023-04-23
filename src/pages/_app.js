import { register } from "next-offline/runtime";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

if (typeof navigator !== "undefined") {
  register("/sw.js");
}

export default MyApp;
