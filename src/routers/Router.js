import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import App from '../containers/App';
import Index from '../containers/index/';
import Page1 from '../containers/Page1/';
import NotFoundPage from '../containers/NotFoundPage/NotFoundPage'

const Router =() =>(
    <BrowserRouter>
        <div>
            <Switch>
                <Route path="/" component={Index} exact />
                
                <Route path="/page1" component={Page1}/>
                <Route component={NotFoundPage}/>
            </Switch>
        </div>    
    </BrowserRouter>
);
export default Router