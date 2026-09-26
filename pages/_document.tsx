import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from "next/document";

interface Props extends DocumentInitialProps {
  locale: string;
}

// Inter for headings, Mukta for body, Roboto Mono for hashes and numbers:
// the same pairing as verifiedx.io and the Switchblade wallet.
const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=Mukta:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap";

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext): Promise<Props> {
    const initialProps = await Document.getInitialProps(ctx);
    const locale = ctx.locale ?? ctx.defaultLocale ?? "en";
    return { ...initialProps, locale };
  }

  render() {
    return (
      <Html lang={this.props.locale}>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
