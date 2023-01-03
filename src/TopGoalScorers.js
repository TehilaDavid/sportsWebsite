import React, {Component} from 'react';
import axios from "axios";
import LeaguesSelect from "./LeaguesSelect";

class TopGoalScorers extends Component {
    state = {
        scorers: []
    }


    getTop = ((leagueId) => {
        this.setState({
            scorers: [],
        })
        axios.get('https://app.seker.live/fm1/history/' + leagueId)
            .then((response) => {
                let isExist = false
                response.data.map((game) => {

                    game.goals.map((goal, goalIndex) => {
                        debugger
                        const scorerName = (goal.scorer.firstName + " " + goal.scorer.lastName)
                        this.state.scorers.map((scorer, index) => {
                            if (scorer.name === scorerName) {
                                isExist = true
                                let newScorer = this.state.scorers
                                let newGoals = scorer.goals + 1
                                newScorer[scorer.index].goals = newGoals
                                this.setState({
                                    scorer: newScorer,
                                })
                            }
                        })
                        if (!isExist) {
                            if (scorerName !== "") {
                                let newScorer = this.state.scorers
                                newScorer.push({name: scorerName, goals: 1, index: (this.state.scorers.length)})
                                this.setState({
                                    scorers: newScorer,
                                })
                            }
                        }
                        isExist = false
                    })
                    this.sortScorersByGoals()
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
        })
    })

    render() {
        return (
            <div>
                <LeaguesSelect responseClick={this.getTop.bind(this)}/>

                {
                    (this.state.scorers.length > 0) &&
                    <table>
                        <th> Scorer Name</th>
                        <th> Goals</th>
                        {
                            this.state.scorers.map((scorer, index) => {
                                if (index < 3) {
                                    return (
                                        <tr>
                                            <td> {scorer.name} </td>
                                            <td> {scorer.goals} </td>
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
