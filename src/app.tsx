import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { BlogPage } from "./pages/blog";
import { HomePage } from "./pages/home";

export function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={HomePage} exact={true}/>
        <Route path="/blog" component={BlogPage}/>
        <Route component={() => <div>404</div>}/>
      </Switch>
    </BrowserRouter>
  )
}
