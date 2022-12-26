import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";

class Tables extends Component {


    state = {
        leagues:[],
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



    render() {
        return (
            <div>
                <select value={this.state.league} onChange={this.leagueChanged}>
                    <option value={"none"} disabled={true}>SELECT LEAGUE</option>
                    {
                        this.state.leagues.map((item) => {
                            return (
                                <option value={item.name}>{item.name + " League"}</option>
                            )
                        })
                    }
                </select>
            </div>
        );
    }
}


export default Tables;