import React, {Component} from 'react';
import Tables from "./Tables";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import './App.css';


class App extends Component {

    render() {

        return (
            <div className={"App"}>
                <BrowserRouter>
                    <NavLink style={{margin : "10px"}} to={"/tables"}>Tables</NavLink>

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