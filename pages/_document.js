import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <link rel="shortcut icon" href={require("assets/img/brand/favicon.ico")} />
          <link rel="apple-touch-icon" sizes="76x76" href={require("assets/img/brand/apple-icon.png")} />
          {/* Fonts and icons */}
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
          {/* Preline CSS (UI components) */}
          <link rel="stylesheet" href="https://unpkg.com/preline/dist/preline.min.css" />
          {/* Early inline blocker to prevent noisy third-party scripts (FullStory) from making failing network calls in dev */}
          <script dangerouslySetInnerHTML={{ __html: `(function(){
            try{
              var blockedHosts=['fullstory.com','edge.fullstory.com','fs.js','fullstory'];
              var origFetch = window.fetch;
              window.fetch = function(input, init){
                try{
                  var url = '';
                  if (typeof input === 'string') url = input;
                  else if (input && input.url) url = input.url;
                  if (url && blockedHosts.some(function(h){return url.indexOf(h)!==-1;})){
                    // swallow calls to blocked hosts
                    return Promise.resolve(new Response(null,{status:204}));
                  }
                }catch(e){}
                return origFetch.apply(this, arguments);
              };
              // prevent injection by removing existing script tags matching blocked hosts
              try{var s=document.getElementsByTagName('script'); for(var i=s.length-1;i>=0;i--){var src=s[i].src||''; if(src && blockedHosts.some(function(h){return src.indexOf(h)!==-1;})){ s[i].parentNode.removeChild(s[i]); } }}catch(e){}
            }catch(e){}
          })();` }} />
          {/* Tailwind CDN for editor styling (loaded only for editor UI) */}
          <script src="https://cdn.tailwindcss.com"></script>
        </Head>
        <body>
          <div id="page-transition"></div>
          <Main />
          <NextScript />
          {/* Preline JS */}
          <script src="https://unpkg.com/preline/dist/preline.umd.js"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
