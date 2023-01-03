import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LeaguesSelect from "./LeaguesSelect";
import axios from "axios";

class Statistics extends Component {
    state = {
        goalsInHalf: [0,0],
        timesGoals: [null,null],
        roundGoals: [null,null],
    }

    statistics = ((leagueId) => {

        // {to: leagueName, nameScorer: , minute: }

        axios.get('https://app.seker.live/fm1/history/' + leagueId)
            .then((response) => {
                let newArray = [0,0]
                let helperTimeGoal = [null,null]
                let numRound = response.data[response.data.length - 1].round
                let minMaxGoalRounds = [null,null]
                for (let i = 1; i <= numRound; i++) {
                    let counter = 0
                    axios.get('https://app.seker.live/fm1/round/' + leagueId + "/" + i)
                        .then((response) => {
                            response.data.map((game) => {
                                debugger
                                counter += game.goals.length
                            })
                            if ((minMaxGoalRounds[0] === null) || (counter < minMaxGoalRounds[0].goals)) {
                                minMaxGoalRounds[0] = {round: i,goals: counter}
                            }

                            if ((minMaxGoalRounds[1] === null) || (counter > minMaxGoalRounds[1].goals)) {
                                minMaxGoalRounds[1] = {round: i,goals: counter}
                            }
                            this.setState({
                                roundGoals: minMaxGoalRounds,
                            })
                        })
                }

                response.data.map((game) => {
                    game.goals.map((goal, goalIndex) => {
                        if (goal.minute > 45) {
                            newArray[0]++
                        }else {
                            newArray[1]++
                        }

                        if ((helperTimeGoal[0] === null) || (goal.minute < helperTimeGoal[0].minute)) {
                            helperTimeGoal[0] = {teamName: ((goal.home) ? game.homeTeam.name : game.awayTeam.name),nameScorer: (goal.scorer.firstName + " " + goal.scorer.lastName),minute: goal.minute,round: game.round}
                        }

                        if ((helperTimeGoal[1] === null) || (goal.minute > helperTimeGoal[1].minute)) {
                            helperTimeGoal[1] = {teamName: ((goal.home) ? game.homeTeam.name : game.awayTeam.name),nameScorer: (goal.scorer.firstName + " " + goal.scorer.lastName),minute: goal.minute,round: game.round}
                        }


                    })
                })
                this.setState({
                    goalsInHalf: newArray,
                    timesGoals: helperTimeGoal,
                })
            })
    })


    render() {
        return (
            <div>
                <LeaguesSelect responseClick={this.statistics.bind(this)}/>
                {
                    (this.state.roundGoals[0] !== null) &&
                    <div>
                        {this.state.roundGoals[0].round} - {this.state.roundGoals[1].round}
                        {/*{this.state.timesGoals[0].nameScorer} - {this.state.timesGoals[1].nameScorer}*/}
                    </div>
                }

            </div>
        );
    }
}


export default Statistics;