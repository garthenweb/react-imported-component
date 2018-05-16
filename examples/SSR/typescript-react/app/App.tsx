import * as React from "react";
import { Helmet } from "react-helmet";
//import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import favicon from "./assets/favicon.ico";
import importedComponent from "react-imported-component";

const Another = importedComponent(() => import(/* webpackChunkName: namedChunk-0 */"./components/Another"));
const Other1 = importedComponent(() => import(/* webpackChunkName: "namedChunk-1" */"./components/Other"));
const Other2 = importedComponent(() => import(/* webpackChunkName: "namedChunk-1" */"./components/OtherTween"));
//import Another from "./components/Another";

export default function App() {
  return (
    <div>
      <Helmet defaultTitle="Hello World!">
        <meta charSet="utf-8" />
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <Home />
      <Another/>
      <Other1 />
      <Other2 />
      <Home/>
    </div>
  );
}
