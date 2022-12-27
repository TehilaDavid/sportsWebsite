import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";

class Tables extends Component {


    state = {
        leagues: [],
        teams: [],
        league: "none",
    }

    getLeagues = () => {
        axios.get('https://app.seker.live/fm1/leagues')
            .then((response) => {
                // debugger
                this.setState({
                    leagues: response.data,
                })
            });
    }

    componentDidMount() {
        this.getLeagues()
    }

    leagueChanged = (event) => {

        this.setState({
            league: event.target.value
        })


    }

    leagueChangedButton = () => {

        axios.get('https://app.seker.live/fm1/teams/' + this.state.league)
            .then((response) => {
                this.setState({
                    teams: response.data,
                })
            });
    }


    render() {
        return (
            <div>
                <select value={this.state.league} onChange={this.leagueChanged}>
                    <option value={"none"} disabled={true}>SELECT LEAGUE</option>
                    {
                        this.state.leagues.map((item) => {
                            return (
                                <option value={item.id}>{item.name + " League"}</option>
                            )
                        })
                    }
                </select>
                <button onClick={this.leagueChangedButton}>Enter</button>


                    <table>
                        <th>
                            Leagues Teams
                        </th>
                        {
                            this.state.teams.map((team) => {
                                return (
                                    <tr>

                                        <td> {team.name} </td>


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