import React, {Component} from 'react';
import Tables from "./Tables";
import LeaguesResults from "./LeaguesResults";
import TopGoalScorers from "./TopGoalScorers";
import Statistics from "./Statistics";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import './App.css';


class App extends Component {

    render() {

        return (
            <div className={"App"}>
                <BrowserRouter>
                    <NavLink activeClassName={"active"} className={"main-link"} to={"/tables"}>Leagues Table</NavLink>
                    <NavLink activeClassName={"active"} className={"main-link"} to={"/leagues-results"}>Leagues Results History</NavLink>
                    <NavLink activeClassName={"active"} className={"main-link"} to={"/top-goal-scorers"}>Top Goal Scorers</NavLink>
                    <NavLink activeClassName={"active"} className={"main-link"} to={"/statistics"}>Leagues Statistics</NavLink>

                    <Routes>
                        <Route path={"/tables"} element={<Tables />}/>
                        <Route path={"/leagues-results"} element={<LeaguesResults />}/>
                        <Route path={"/top-goal-scorers"} element={<TopGoalScorers />}/>
                        <Route path={"/statistics"} element={<Statistics />}/>
                        {/*<Route path={"*"} element={<NoPage/>}/>*/}

                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;