import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="google-adsense-account" content="ca-pub-8699441082010152" />
        <title>Watch Archive</title>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="shortcut icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
