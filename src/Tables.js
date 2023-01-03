import React, {Component} from 'react';
import axios from "axios";
import LeaguesSelect from "./LeaguesSelect";

class Tables extends Component {

    state = {
        currentLeagueId: '',
        currentTeamIndex: '',
        teams: [],
        squad: []
    }

    getTeams = (leagueId) => {
        this.setState({
            currentLeagueId : leagueId,
            squad: []
        })
        let teamsToAdd = [];
        axios.get('https://app.seker.live/fm1/teams/' + leagueId)
            .then((response) => {
                response.data.map((team) => {
                    let points = 0;
                    let currentTeamGoals = 0;
                    let rivalTeamGoals = 0;

                    axios.get('https://app.seker.live/fm1/history/' + leagueId + "/" + team.id)
                        .then((response) => {
                            let teamHistory = [];

                            response.data.map((round, index) => {
                                const isHomeTeam = (response.data[index].homeTeam.id === team.id)
                                let currentRoundTeamGoals = 0;
                                let rivalRoundTeamGoals = 0;

                                round.goals.map((goal) => {
                                    if ((goal.home && isHomeTeam) || (!goal.home && !isHomeTeam)){
                                        currentRoundTeamGoals ++;
                                    }else {
                                        rivalRoundTeamGoals ++;
                                    }
                                })

                                let roundResults = '';
                                if (isHomeTeam){
                                    roundResults = response.data[index].homeTeam.name + " " + currentRoundTeamGoals + " - " + rivalRoundTeamGoals + " " + response.data[index].awayTeam.name;
                                }else {
                                    roundResults = response.data[index].awayTeam.name + " " + currentRoundTeamGoals + " - " + rivalRoundTeamGoals + " " + response.data[index].homeTeam.name;
                                }

                                teamHistory.push(("Round " + (index+1) + " -->  " + roundResults));

                                if (currentRoundTeamGoals > rivalRoundTeamGoals) {
                                    points += 3;
                                }else if (currentRoundTeamGoals === rivalRoundTeamGoals){
                                    points += 1;
                                }
                                currentTeamGoals += currentRoundTeamGoals;
                                rivalTeamGoals += rivalRoundTeamGoals;
                            })
                            teamsToAdd.push({id: team.id, name: team.name, information: {score: points, goalsDifference: (currentTeamGoals - rivalTeamGoals)}, history: teamHistory})
                            teamsToAdd.sort((a,b) => {
                                const pointDifference = b.information.score - a.information.score
                                if (pointDifference === 0) {
                                    const goalsDifferenceDifference = b.information.goalsDifference - a.information.goalsDifference
                                    if (goalsDifferenceDifference === 0) {
                                        return (b.name - a.name)
                                    }
                                    return goalsDifferenceDifference
                                }
                                return pointDifference
                            })
                            this.setState({
                                teams: teamsToAdd,
                            })
                        });
                })


            });
    }

    teamsSort = (() => {
        let help = []
        help.sort((a,b) => {
            const pointDifference = b.information.score - a.information.score
            if (pointDifference === 0) {
                const goalsDifferenceDifference = b.information.goalsDifference - a.information.goalsDifference
                if (goalsDifferenceDifference === 0) {
                    return (b.name - a.name)
                }
                return goalsDifferenceDifference
            }
            return pointDifference
        })
        this.setState({
            teams: help,
        })
    })


    teamInformation = (teamId, teamIndex) => {
        axios.get('https://app.seker.live/fm1/squad/' + this.state.currentLeagueId + '/' + teamId )
            .then((response) => {
                this.setState({
                    squad: response.data,
                    currentTeamIndex: teamIndex
                })
            })
    }

    render() {
        return (
            <div>
                <LeaguesSelect responseClick={this.getTeams.bind(this)}/>

                {
                    (this.state.teams.length > 0) &&
                    <table>
                        <th> Leagues Teams </th>
                        <th> Team Scores </th>
                        {
                            this.state.teams.map((team, index) => {
                                return (
                                    <tr>
                                        <td onClick={() => this.teamInformation(team.id,index)}> {team.name} </td>
                                        <td> {team.information.score} </td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                }

                {
                    (this.state.squad.length > 0) &&
                    <ul>
                        <p>Squad Members of "{this.state.teams[this.state.currentTeamIndex].name}":</p>
                        {
                            this.state.squad.map((player) => {
                                return(
                                    <li>
                                        {player.firstName} {player.lastName}
                                    </li>
                                )
                            })
                        }
                        <p>History of "{this.state.teams[this.state.currentTeamIndex].name}":</p>
                        {
                            this.state.teams[this.state.currentTeamIndex].history.map((round) => {
                                return(
                                    <li>
                                        {round}
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
            </div>

        );
    }
}
export default Tables;