import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import Tables from "./Tables";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import './App.css';


class App extends Component {




    render() {
        return (
            <div className={"App"}>
                <BrowserRouter>
                    <NavLink style={{margin : "10px"}} to={"/tables"}>Tables</NavLink>
                    {/*<NavLink style={{margin : "10px"}} to={"/smile"}>Smile</NavLink>*/}
                    {/*<NavLink style={{margin : "10px"}} to={"/counter"}>Counter</NavLink>*/}

                    <Routes>
                        <Route path={"/tables"} element={<Tables />}/>
                        {/*<Route path={"*"} element={<NoPage/>}/>*/}

                    </Routes>
                </BrowserRouter>

            </div>
        );
    }
}

export default App;