import React, {Component} from 'react';
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import './App.css';
import Tables from "./Tables";
import LeaguesResults from "./LeaguesResults";
import TopGoalScorers from "./TopGoalScorers";
import Statistics from "./Statistics";


class App extends Component {

    render() {

        return (
            <div className={"App"}>
                <BrowserRouter>
                    <NavLink style={{margin : "10px"}} to={"/tables"}>Tables</NavLink>
                    <NavLink style={{margin : "10px"}} to={"/leaguesResults"}>Leagues Results History</NavLink>
                    <NavLink style={{margin : "10px"}} to={"/topGoalScorers"}>Top Goal Scorers</NavLink>
                    <NavLink style={{margin : "10px"}} to={"/statistics"}>Statistics</NavLink>


                    <Routes>
                        <Route path={"/tables"} element={<Tables />}/>
                        <Route path={"/leaguesResults"} element={<LeaguesResults />}/>
                        <Route path={"/topGoalScorers"} element={<TopGoalScorers />}/>
                        <Route path={"/statistics"} element={<Statistics />}/>
                        {/*<Route path={"*"} element={<NoPage/>}/>*/}
                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;