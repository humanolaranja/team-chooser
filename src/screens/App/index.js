import React, { Component } from 'react'

export default class App extends Component {
  state = {
    currentInputText: '',
    lastTeamChoosed: null,
    total: 24,
    teams: [
      {
        name: 'Bulbassauro',
        members: []
      },
      {
        name: 'Charmander',
        members: []
      },
      {
        name: 'Squirtle',
        members: []
      },
      {
        name: 'Pikachu',
        members: []
      },
    ]
  }

  handleCalculateMaxTeamMembers = () => {
    const { teams, total } = this.state;
    const teamsLength = teams.length;
    const maxlength = total / teamsLength;

    return Math.ceil(maxlength);
  }

  handleTeamAlreadyFull = (teamIndex) => {
    const { teams } = this.state;
    const sizes = teams.map((el) => el.members.length);
    const maxlength = this.handleCalculateMaxTeamMembers();

    if(sizes[teamIndex] >= maxlength) {
      return true;
    }
    return false;
  }

  handleAlreadyFull = () => {
    const { teams, total } = this.state;
    const sizes = teams.map((el) => el.members.length);
    const alreadyFull = sizes.reduce((a, b) => a + b)

    if(alreadyFull >= total) {
      return true;
    }
    return false;
  }

  handleGetCurrentMaxTeam = (index = true) => {
    const { teams } = this.state;
    const sizes = teams.map((el) => el.members.length);

    return index ? sizes.indexOf(Math.max(...sizes)) : Math.max(...sizes);
  }

  handleGetCurrentMinTeam = (index = true) => {
    const { teams } = this.state;
    const sizes = teams.map((el) => el.members.length);

    return index ? sizes.indexOf(Math.min(...sizes)) : Math.min(...sizes);
  }

  handleDrawTeam = () => {
    const { lastTeamChoosed } = this.state;
    const states = {
      0: [1, 2, 3],
      1: [0, 2, 3],
      2: [0, 1, 3],
      3: [0, 1, 2]
    };
    let teamIndex = null;

    if (lastTeamChoosed === null) {
      teamIndex = Math.floor(Math.random() * Object.keys(states).length);
    }
    else if (this.handleGetCurrentMaxTeam(false) - this.handleGetCurrentMinTeam(false) > 1) {
      teamIndex = this.handleGetCurrentMinTeam();
    }
    else {
      do {
        if(this.handleAlreadyFull()) {
          teamIndex = null;
          break;
        }
        teamIndex = states[lastTeamChoosed][Math.floor(Math.random() * (Object.keys(states).length - 1))];
      } while (teamIndex === this.handleGetCurrentMaxTeam() || this.handleTeamAlreadyFull(teamIndex));
    }

    return teamIndex;
  }

  handleChange = (event) => {
    this.setState({ currentInputText: event.target.value });
  }

  handleSubmit = (event) => {
    const { currentInputText, teams } = this.state;
    const drawnTeamIndex = this.handleDrawTeam();
    const drawnTeam = teams[drawnTeamIndex];
    if(drawnTeam) {
      const newTeam = [{ ...drawnTeam, members: [...drawnTeam.members, currentInputText] }]
      const newTeams = teams.map(obj => newTeam.find(o => o.name === obj.name) || obj);
  
      this.setState({ currentInputText: '', teams: newTeams, lastTeamChoosed: drawnTeamIndex });
    } else {
      alert('Acabou');
    }
    event.preventDefault();
  }

  render() {
    const { currentInputText } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={currentInputText} onChange={this.handleChange} />
          <input type="submit" value="Eu escolho você" />
        </form>
      </div>
    )
  }
}