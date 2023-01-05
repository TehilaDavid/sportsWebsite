import React, {Component} from 'react';
import LeaguesSelect from "./LeaguesSelect";
import axios from "axios";

const MIN_INDEX = 0;
const MAX_INDEX = 1;
const HALF = 45;
const FIRST_HALF_INDEX = 0;
const SECOND_HALF_INDEX = 1;

class Statistics extends Component {
    state = {
        goalsInHalf: [],
        firstLastGoals: [],
        minMaxRoundGoals: [],
        pageLoadingData: true
    }

    statistics = ((leagueId) => {
        this.setState({
            pageLoadingData: true
        })

        axios.get('https://app.seker.live/fm1/history/' + leagueId)
            .then((response) => {
                let roundsAmount = response.data[response.data.length - 1].round
                this.searchMinMaxGoalsRound(roundsAmount, leagueId);

                let newGoalsArray = [0,0];
                let helperTimeGoal = [null,null]

                response.data.map((game) => {
                    game.goals.map((goal) => {
                        if (goal.minute > HALF) {
                            newGoalsArray[FIRST_HALF_INDEX]++
                        }else {
                            newGoalsArray[SECOND_HALF_INDEX]++
                        }

                        if ((helperTimeGoal[MIN_INDEX] === null) || (goal.minute < helperTimeGoal[MIN_INDEX].minute)) {
                            helperTimeGoal[MIN_INDEX] = {teamName: ((goal.home) ? game.homeTeam.name : game.awayTeam.name),nameScorer: (goal.scorer.firstName + " " + goal.scorer.lastName),minute: goal.minute,round: game.round}
                        }

                        if ((helperTimeGoal[MAX_INDEX] === null) || (goal.minute > helperTimeGoal[MAX_INDEX].minute)) {
                            helperTimeGoal[MAX_INDEX] = {teamName: ((goal.home) ? game.homeTeam.name : game.awayTeam.name),nameScorer: (goal.scorer.firstName + " " + goal.scorer.lastName),minute: goal.minute,round: game.round}
                        }


                    })
                })
                this.setState({
                    goalsInHalf: newGoalsArray,
                    firstLastGoals: helperTimeGoal,
                    pageLoadingData: false
                })
            })
    })

    searchMinMaxGoalsRound = (roundsAmount, leagueId) => {
        let minMaxGoalsRounds = [null,null]
        for (let i = 1; i <= roundsAmount; i++) {
            let counter = 0
            axios.get('https://app.seker.live/fm1/round/' + leagueId + "/" + i)
                .then((response) => {

                    response.data.map((game) => {
                        counter += game.goals.length
                    })
                    if ((minMaxGoalsRounds[MIN_INDEX] === null) || (counter < minMaxGoalsRounds[MIN_INDEX].goals)) {
                        minMaxGoalsRounds[MIN_INDEX] = {round: i,goals: counter}
                    }
                    if ((minMaxGoalsRounds[MAX_INDEX] === null) || (counter > minMaxGoalsRounds[MAX_INDEX].goals)) {
                        minMaxGoalsRounds[MAX_INDEX] = {round: i,goals: counter}
                    }
                    this.setState({
                        minMaxRoundGoals: minMaxGoalsRounds,
                    })
                })
        }
    }

    render() {
        return (
            <div>
                <LeaguesSelect responseClick={this.statistics.bind(this)}/>
                {
                    (!this.state.pageLoadingData) &&
                    <div>
                        <div>
                            <table className={"statistics-table"}>
                                <tr>
                                    <th className={"statistics-table-th"}>First League Half Goals</th>
                                    <th className={"statistics-table-th"}>Second League Half Goals</th>
                                </tr>
                                <tr className={"statistics-table-tr"}>
                                    {
                                        this.state.goalsInHalf.map((goals) =>{
                                            return(
                                                <td className={"statistics-table-td"}>{goals}</td>
                                            )
                                        })
                                    }
                                </tr>
                            </table>
                        </div>
                        <br/>
                        <div>
                            <table className={"statistics-table"}>
                                <tr>
                                    <th className={"statistics-table-th"}></th>
                                    <th className={"statistics-table-th"}>The Earliest Goal</th>
                                    <th className={"statistics-table-th"}>The Latest Goal</th>
                                </tr>
                                <tr className={"statistics-table-tr"}>
                                    <td className={"statistics-table-td"}>Team:</td>
                                    {
                                        this.state.firstLastGoals.map((goal) => {
                                            return(
                                                <td className={"statistics-table-td"}>{goal.teamName}</td>
                                            )
                                        })
                                    }
                                </tr>
                                <tr className={"statistics-table-tr"}>
                                    <td className={"statistics-table-td"}>Scorer:</td>
                                    {
                                        this.state.firstLastGoals.map((goal) => {
                                            return(
                                                <td className={"statistics-table-td"}>{goal.nameScorer}</td>
                                            )
                                        })
                                    }
                                </tr>
                                <tr className={"statistics-table-tr"}>
                                    <td className={"statistics-table-td"}>Minute:</td>
                                    {
                                        this.state.firstLastGoals.map((goal) => {
                                            return(
                                                <td className={"statistics-table-td"}>{goal.minute}</td>
                                            )
                                        })
                                    }
                                </tr>
                                <tr className={"statistics-table-tr"}>
                                    <td className={"statistics-table-td"}>Round:</td>
                                    {
                                        this.state.firstLastGoals.map((goal) => {
                                            return(
                                                <td className={"statistics-table-td"}>{goal.round}</td>
                                            )
                                        })
                                    }
                                </tr>
                            </table>
                        </div>
                        <br/>
                        <div>
                            <table className={"statistics-table"}>
                                <tr>
                                    <th className={"statistics-table-th"}></th>
                                    <th className={"statistics-table-th"}>Round</th>
                                    <th className={"statistics-table-th"}>Goal's Amount</th>
                                </tr>
                                {
                                    this.state.minMaxRoundGoals.map((round, index) => {
                                        return(
                                            <tr className={"statistics-table-tr"}>
                                                <td className={"statistics-table-td"}>{(index === MIN_INDEX) ? "Fewest goals:" : "Most goals:"}</td>
                                                <td className={"statistics-table-td"}>{round.round}</td>
                                                <td className={"statistics-table-td"}>{round.goals}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </table>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Statistics;