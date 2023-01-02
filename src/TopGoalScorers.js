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
                let theScorer = ""
                response.data.map((round) => {

                    round.goals.map((goal, goalIndex) => {

                        this.state.scorers.map((scorer, index) => {
                            const scorerName = (goal.scorer.firstName + " " + goal.scorer.lastName)
                            debugger
                            theScorer = scorerName
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
                            // if (theScorer !== "") {
                            let newScorer = this.state.scorers
                            newScorer.push({name: theScorer, goals: 1, index: (this.state.scorers.length)})
                            //-1 if without ""
                            this.setState({
                                scorers: newScorer,
                            })
                            isExist = false
                            // }
                        }
                        isExist = false
                    })
                })
            })
    })

    render() {
        return (
            <div>
                {this.state.scorers.length}
                <LeaguesSelect responseClick={this.getTop.bind(this)}/>

                {
                    (this.state.scorers.length > 0) &&
                    <table>
                        <th> Scorer Name</th>
                        <th> Goals</th>
                        {
                            this.state.scorers.map((scorer, index) => {
                                return (
                                    <tr>
                                        <td> {scorer.name} </td>
                                        <td> {scorer.goals} </td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                }
            </div>
        )
    }
}

export default TopGoalScorers;
