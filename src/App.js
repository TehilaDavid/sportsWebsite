import React, {Component} from 'react';
import Tables from "./Tables";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import './App.css';
import LeaguesResults from "./LeaguesResults";


class App extends Component {

    render() {

        return (
            <div className={"App"}>
                <BrowserRouter>
                    <NavLink style={{margin : "10px"}} to={"/tables"}>Tables</NavLink>
                    <NavLink style={{margin : "10px"}} to={"/leaguesResults"}>Leagues Results History</NavLink>

                    <Routes>
                        <Route path={"/tables"} element={<Tables />}/>
                        <Route path={"/leaguesResults"} element={<LeaguesResults />}/>
                        {/*<Route path={"*"} element={<NoPage/>}/>*/}
                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;