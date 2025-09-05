import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import { SessionProvider } from "next-auth/react";

import PageChange from "components/PageChange/PageChange.js";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/nextjs-argon-dashboard.scss";
import "../styles/globals.css";

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
    let comment = document.createComment(`

=========================================================
* * NextJS Argon Dashboard v1.1.0 based on Argon Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-argon-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-argon-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

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
          __webpack_require__.nmd = function(module) {
            try {
              if (!module) return module;
              module.paths = module.paths || [];
              module.children = module.children || [];
            } catch (e) {}
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
        // Radical mitigation: remove or disable FullStory/other noisy third-party scripts injected into the page
        try {
          const blockedHosts = ['fullstory.com', 'edge.fullstory.com', 'fs.js', 'fullstory'];
          // remove existing script tags that match blocked hosts
          document.querySelectorAll('script[src]').forEach(s => {
            try {
              const src = s.src || '';
              if (blockedHosts.some(h => src.indexOf(h) !== -1)) {
                console.warn('Removing blocked third-party script:', src);
                s.parentNode && s.parentNode.removeChild(s);
              }
            } catch (e) {}
          });
          // attempt to shutdown FullStory global if present
          try {
            if (window.FS && typeof window.FS.shutdown === 'function') {
              try { window.FS.shutdown(); } catch (e) {}
            }
            // remove global references
            try { delete window.FS; } catch (e) {}
            try { delete window._fs_script; } catch (e) {}
          } catch (e) {}

          // monkey-patch fetch to silently handle requests to blocked hosts
          try {
            const originalFetch = window.fetch.bind(window);
            window.fetch = function(input, init) {
              try {
                let url = '';
                if (typeof input === 'string') url = input;
                else if (input && input.url) url = input.url;
                if (url && blockedHosts.some(h => url.indexOf(h) !== -1)) {
                  console.warn('Blocked fetch to', url);
                  try {
                    return Promise.resolve(new Response(null, { status: 204 }));
                  } catch (e) {
                    // Response may not be available in some envs; return a resolved object compatible enough
                    return Promise.resolve({ ok: false, status: 0, text: () => Promise.resolve('') });
                  }
                }
              } catch (e) {}
              return originalFetch(input, init);
            };
          } catch (e) {}
        } catch (e) {
          console.warn('Error while attempting to remove third-party scripts', e);
        }

        window.addEventListener('unhandledrejection', (ev) => {
          // swallow AbortError from overlays or HMR which are non-critical in dev
          try {
            const reason = ev && ev.reason;
            if (reason && reason.name === 'AbortError') {
              console.warn('Suppressed AbortError from dev overlay/HMR');
              ev.preventDefault && ev.preventDefault();
              return;
            }
            // suppress noisy network fetch failures coming from third-party scripts (e.g. FullStory) or HMR
            if (reason && reason.message && reason.message.indexOf('Failed to fetch') !== -1) {
              console.warn('Suppressed network fetch error (unhandledrejection):', reason);
              ev.preventDefault && ev.preventDefault();
              return;
            }
          } catch (e) {}
        });
        window.addEventListener('error', (ev) => {
          // prevent dev overlay from stopping execution on non-critical errors
          try {
            const msg = ev && ev.message;
            const src = ev && ev.filename;
            if (msg && msg.indexOf('React Dev Overlay') !== -1) {
              ev.preventDefault && ev.preventDefault();
              return;
            }
            // suppress TypeError: Failed to fetch coming from injected 3rd party scripts (edge.fullstory.com)
            if (msg && msg.indexOf('Failed to fetch') !== -1) {
              // if filename indicates fullstory or webpack HMR, suppress
              if (src && (src.indexOf('fullstory') !== -1 || src.indexOf('webpack') !== -1 || src.indexOf('fs.js') !== -1)) {
                console.warn('Suppressed network fetch error (window.error):', msg, src);
                ev.preventDefault && ev.preventDefault();
                return;
              }
              // general suppression in dev to avoid noisy overlay
              if (process.env.NODE_ENV !== 'production') {
                console.warn('Suppressed network fetch error (window.error):', msg, src);
                ev.preventDefault && ev.preventDefault();
                return;
              }
            }
          } catch (e) {}
        });
      }
    } catch (e) {}
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
          <title>NextJS Argon Dashboard by Creative Tim</title>
        </Head>
        <SessionProvider session={pageProps.session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </React.Fragment>
    );
  }
}
