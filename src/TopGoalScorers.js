import React, {Component} from 'react';
import axios from "axios";
import LeaguesSelect from "./LeaguesSelect";

class TopGoalScorers extends Component {
    state = {
        scorers: [],
        tableLoadingData: true
    }


    getTop = ((leagueId) => {
        this.setState({
            scorers: [],
            tableLoadingData: true
        })
        axios.get('https://app.seker.live/fm1/history/' + leagueId)
            .then((response) => {
                response.data.map((game) => {

                    game.goals.map((goal) => {
                        let isExist = false
                        const scorerName = (goal.scorer.firstName + " " + goal.scorer.lastName)
                        this.state.scorers.map((scorer, index) => {
                            if (scorer.name === scorerName) {
                                isExist = true
                                let scorersArray = this.state.scorers
                                scorersArray[index].goals = scorer.goals + 1
                                this.setState({
                                    scorers: scorersArray,
                                })
                            }
                        })
                        if (!isExist) {
                            let newScorer = this.state.scorers
                            newScorer.push({name: scorerName, goals: 1})
                            this.setState({
                                scorers: newScorer,
                            })
                        }
                    })
                    this.sortScorersByGoals();
                })
            })
    })

    sortScorersByGoals = (() => {
        let arrayToSort = this.state.scorers
        arrayToSort.sort((a, b) => {
            return b.goals - a.goals
        })
        this.setState({
            scorers: arrayToSort,
            tableLoadingData: false
        })
    })

    render() {
        return (
            <div>
                <LeaguesSelect responseClick={this.getTop.bind(this)}/>

                {
                    (!this.state.tableLoadingData) &&
                    <table className={"league-table"}>
                        <tr>
                            <th> Scorer Name</th>
                            <th> Goals</th>
                        </tr>

                        {
                            this.state.scorers.map((scorer, index) => {
                                if (index < 3) {
                                    return (
                                        <tr className={"league-table-tr"}>
                                            <td className={"league-table-td"}> {scorer.name} </td>
                                            <td className={"league-table-td"}> {scorer.goals} </td>
                                        </tr>
                                    )
                                }
                            })
                        }
                    </table>
                }
            </div>
        )
    }
}

export default TopGoalScorers;