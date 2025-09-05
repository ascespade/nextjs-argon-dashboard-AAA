import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

import PageChange from "components/PageChange/PageChange.js";

// Preline CSS will be loaded via CDN in the Head component
import "@fortawesome/fontawesome-free/css/all.min.css";

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  document.body.classList.add("body-page-transition");
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

export default class MyApp extends App {
  componentDidMount() {
    // Load Preline from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/preline@2.0.3/dist/preline.min.js';
    script.onload = () => {
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    };
    document.head.appendChild(script);

    let comment = document.createComment(`

=========================================================
* * NextJS Dashboard with Preline UI
=========================================================

* Converted from Argon Dashboard to use Preline UI components
* Modern, responsive, and beautiful UI components

=========================================================

`);
    document.insertBefore(comment, document.documentElement);

    // Dynamically load Google Maps only when a valid API key is provided.
    try {
      const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (key && key !== 'YOUR_KEY_HERE') {
        const existing = document.querySelector('script[data-google-maps]');
        if (!existing) {
          const s = document.createElement('script');
          s.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
          s.async = true;
          s.defer = true;
          s.setAttribute('data-google-maps', 'true');
          s.onerror = () => console.warn('Failed to load Google Maps script');
          document.head.appendChild(s);
        }
      } else {
        // Avoid loading placeholder key which causes InvalidKeyMapError
        console.warn('Google Maps API key not set. To enable maps, set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.');
      }
    } catch (e) {
      console.warn('Error loading Google Maps script', e);
    }

    // Client-side shim for __webpack_require__.nmd to support legacy UMD modules
    try {
      if (typeof window !== 'undefined' && typeof __webpack_require__ !== 'undefined') {
        if (typeof __webpack_require__.nmd !== 'function') {
          __webpack_require__.nmd = function (module) {
            try {
              if (!module) return module;
              module.paths = module.paths || [];
              module.children = module.children || [];
            } catch (e) { }
            return module;
          };
        }
      }
    } catch (e) {
      // Non-critical
    }

    // Global client-side handlers to avoid noisy aborts/crashes in dev tooling
    try {
      if (typeof window !== 'undefined') {
        window.addEventListener('unhandledrejection', (ev) => {
          // swallow AbortError from overlays or HMR which are non-critical in dev
          try {
            const reason = ev && ev.reason;
            if (reason && reason.name === 'AbortError') {
              console.warn('Suppressed AbortError from dev overlay/HMR');
              ev.preventDefault && ev.preventDefault();
            }
          } catch (e) { }
        });
        window.addEventListener('error', (ev) => {
          // prevent dev overlay from stopping execution on non-critical errors
          try {
            const msg = ev && ev.message;
            if (msg && msg.indexOf('React Dev Overlay') !== -1) {
              ev.preventDefault && ev.preventDefault();
            }
          } catch (e) { }
        });
      }
    } catch (e) { }
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>NextJS Enterprise Dashboard with Preline UI</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/preline@2.0.3/dist/preline.min.css" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </React.Fragment>
    );
  }
}
