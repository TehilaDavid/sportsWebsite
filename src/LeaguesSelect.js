import React, {Component} from 'react';
import axios from "axios";

class LeaguesSelect extends Component {

    state = {
        leagues: [],
        leagueId: "none",
    }

    componentDidMount() {
        this.getLeagues()
    }

    getLeagues = () => {
        axios.get('https://app.seker.live/fm1/leagues')
            .then((response) => {
                this.setState({
                    leagues: response.data,
                })
            });
    }

    leagueChanged = (event) => {
        this.setState({
            leagueId: event.target.value
        })
    }

    render() {
        return (
            <div>
                <select value={this.state.leagueId} onChange={this.leagueChanged}>
                    <option value={"none"} disabled={true}>SELECT LEAGUE</option>
                    {
                        this.state.leagues.map((league) => {
                            return (
                                <option value={league.id}>{league.name + " League"}</option>
                            )
                        })
                    }
                </select>
                <button onClick={() => this.props.responseClick(this.state.leagueId)}>Enter</button>
            </div>
        );
    }
}
export default LeaguesSelect;