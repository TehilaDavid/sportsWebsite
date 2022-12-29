import React, {Component} from 'react';
import axios from "axios";
import LeaguesSelect from "./LeaguesSelect";

class Tables extends Component {

    state = {
        teams: [],
        // scoreInfo : {score: 0, goalsDifference: 0}
    }

    getTeams = (leagueId) => {
        let teamsToAdd = [];
        axios.get('https://app.seker.live/fm1/teams/' + leagueId)
            .then((response) => {
                response.data.map((team, index) => {
                    // this.calculateScore(team.id, leagueId)
                    teamsToAdd.push({id: team.id, name: team.name, information: this.calculateScore(team.id, leagueId)})
                })
                this.setState({
                    teams: teamsToAdd,
                })
            });
    }

    calculateScore = (teamId, leaguesId) => {
        let calculateScoreToAdd = {score: 0, goalsDifference: 0};
        let points = 0;
        let currentTeamGoals = 0;
        let rivalTeamGoals = 0;

        axios.get('https://app.seker.live/fm1/history/' + leaguesId + "/" + teamId)
            .then((response) => {
                const isHomeTeam = (response.data[0].homeTeam.id === teamId)

                response.data.map((round) => {
                    let currentRoundTeamGoals = 0;
                    let rivalRoundTeamGoals = 0;

                    round.goals.map((goal) => {
                        if ((goal.home && isHomeTeam) || (!goal.home && !isHomeTeam)){
                            currentRoundTeamGoals ++;
                        }else {
                            rivalRoundTeamGoals ++;
                        }
                    })

                    if (currentRoundTeamGoals > rivalRoundTeamGoals) {
                        points += 3;
                    }else if (currentRoundTeamGoals === rivalRoundTeamGoals){
                        points += 1;
                    }
                    currentTeamGoals += currentRoundTeamGoals;
                    rivalTeamGoals += rivalRoundTeamGoals;
                })
                calculateScoreToAdd = {score: points, goalsDifference: (currentTeamGoals - rivalTeamGoals)}

                // this.setState({
                //     scoreInfo : calculateScoreToAdd
                // })
            });
        debugger
        return calculateScoreToAdd;
    }

    render() {
        return (
            <div>
                <LeaguesSelect responseClick={this.getTeams.bind(this)}/>
                <table>
                    <th>
                        Leagues Teams
                    </th>
                    {
                        this.state.teams.map((team) => {
                            return (
                                <tr>
                                    <td> {team.name} </td>
                                    <td> {team.information.goalsDifference} </td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>

        );
    }
}
export default Tables;