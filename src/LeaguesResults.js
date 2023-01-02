import React, {Component} from 'react';
import axios from "axios";
import LeaguesSelect from "./LeaguesSelect";

class LeaguesResults extends Component {

    state = {
        leaguesHistory: [],
        min: "",
        max: "",
    }

    getLeaguesHistory = (leagueId) => {
        axios.get('https://app.seker.live/fm1/history/' + leagueId)
            .then((response) => {
                let helperArray = [];
                response.data.map((game) => {
                    let homeTeamGoals = 0;
                    let awayTeamGoals = 0;
                    game.goals.map((goal) => {
                        if (goal.home){
                            homeTeamGoals ++;
                        }else {
                            awayTeamGoals ++;
                        }
                    })
                    let currentRoundArray = [];
                    if (helperArray[game.round] != null){
                        currentRoundArray = helperArray[game.round];
                    }
                    currentRoundArray.push(game.homeTeam.name + " " + homeTeamGoals + " - " + awayTeamGoals + " " + game.awayTeam.name);
                    helperArray[game.round] = currentRoundArray;
                    this.setState({
                        leaguesHistory : helperArray,
                        max : helperArray.length-1,
                        min : 1
                    })

                })
            });
    }

    changeMaxValue = (event) => {
        if (((this.state.leaguesHistory.length > event.target.value) && (1 <= event.target.value)) || (event.target.value === "")){
            this.setState({
                max: event.target.value
            })
        }
    }

    changeMinValue = (event) => {
        if (((1 <= event.target.value) && (this.state.leaguesHistory.length > event.target.value)) || (event.target.value === "")){
            this.setState({
                min: event.target.value
            })
        }
    }

    render() {
        return (
            <div>
                <LeaguesSelect responseClick={this.getLeaguesHistory.bind(this)}/>
                {
                    (this.state.leaguesHistory.length > 0) &&
                    <div>
                        Max rounds : <input type={"number"} value={this.state.max} onChange={this.changeMaxValue}/>
                        <br/>
                        Min rounds : <input type={"number"} value={this.state.min} onChange={this.changeMinValue}/>
                    </div>
                }
                {
                    (this.state.min !== "" && this.state.max !== "" && this.state.min <= this.state.max) &&
                    <div>
                        {
                            this.state.leaguesHistory.map((round, index) => {
                                if (index >= this.state.min && index <= this.state.max)
                                {
                                    return (
                                        <ul>
                                            <p>Round {index}</p>
                                            {
                                                round.map((game) => {
                                                    return (
                                                        <li> {game} </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    )
                                }
                            })
                        }
                    </div>
                }
            </div>
        )
    }
}
export default LeaguesResults;
