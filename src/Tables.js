import React, {Component} from 'react';
import axios from "axios";
import LeaguesSelect from "./LeaguesSelect";

const WIN_POINTS = 3;
const STANDOFF_POINTS = 1;

class Tables extends Component {

    state = {
        currentLeagueId: '',
        currentTeamIndex: '',
        teams: [],
        squad: [],
        tableLoadingData: true
    }

    getTeams = (leagueId) => {
        this.reset(leagueId)

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

                                teamHistory.push((roundResults));

                                if (currentRoundTeamGoals > rivalRoundTeamGoals) {
                                    points += WIN_POINTS;
                                }else if (currentRoundTeamGoals === rivalRoundTeamGoals){
                                    points += STANDOFF_POINTS;
                                }
                                currentTeamGoals += currentRoundTeamGoals;
                                rivalTeamGoals += rivalRoundTeamGoals;
                            })
                            teamsToAdd.push({id: team.id, name: team.name, information: {score: points, goalsDifference: {currentTeamGoals: currentTeamGoals,rivalTeamGoals: rivalTeamGoals}}, history: teamHistory})
                            this.sortArray(teamsToAdd);

                            this.setState({
                                teams: teamsToAdd,
                            })
                        });
                })
                this.setState({
                    tableLoadingData: false
                })
            });

    }

    reset = (leagueId) => {
        this.setState({
            currentLeagueId : leagueId,
            squad: [],
            tableLoadingData: true
        })
    }

    sortArray = (teamsToAdd) => {
        teamsToAdd.sort((a, b) => {
            let scoresCompare = (b.information.score - a.information.score)
            if ( scoresCompare === 0) {
                let goalsDifferenceCompare = ((b.information.goalsDifference.currentTeamGoals - b.information.goalsDifference.rivalTeamGoals )- (a.information.goalsDifference.currentTeamGoals - a.information.goalsDifference.rivalTeamGoals))
                if (goalsDifferenceCompare === 0){
                    return ((a.name).localeCompare(b.name));
                }
                return goalsDifferenceCompare;
            }
            return scoresCompare;
        })
    }

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
                    (!this.state.tableLoadingData ) &&
                    <table className={"league-table"}>
                        <tr>
                            <th className={"league-table-th"}> Leagues Teams </th>
                            <th className={"league-table-th"}> Team Scores </th>
                            <th className={"league-table-th"}> Team Goals Difference </th>
                        </tr>
                        {
                            this.state.teams.map((team, index) => {
                                return (
                                    <tr className={"emphasis league-table-tr " + ((index === 0) ? "top" : ((index >= (this.state.teams.length - 3)) ? "lower" : ""))}  onClick={() => this.teamInformation(team.id,index)}>
                                        <td className={"league-table-td"}> {team.name} </td>
                                        <td className={"league-table-td"}> {team.information.score} </td>
                                        <td className={"league-table-td"}> {team.information.goalsDifference.currentTeamGoals} : {team.information.goalsDifference.rivalTeamGoals} </td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                }

                {
                    (this.state.squad.length > 0) &&
                    <div>
                        <ul>
                            <p>Squad Members of "{this.state.teams[this.state.currentTeamIndex].name}"</p>
                            {
                                this.state.squad.map((player) => {
                                    return(
                                        <li>
                                            {player.firstName} {player.lastName}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <p>History of "{this.state.teams[this.state.currentTeamIndex].name}"</p>
                        <table className={"history-table"}>
                            {
                                this.state.teams[this.state.currentTeamIndex].history.map((round, index) => {
                                    return(
                                        <tr className={"history-table-tr"}>
                                            <td className={"history-table-td"}>Round {index+1}:</td>
                                            <td className={"history-table-td"}>{round}</td>
                                        </tr>

                                    )
                                })
                            }
                        </table>
                    </div>
                }
            </div>

        );
    }
}
export default Tables;