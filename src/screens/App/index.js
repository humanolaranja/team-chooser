import React, { Component } from 'react';
import '../../styles/main.css';

export default class App extends Component {
  state = {
    currentInputText: '',
    currentHighlight: '',
    lastTeamChoosed: null,
    total: 24,
    teams: [
      {
        name: 'Bulbassauro',
        color: '#374D2C',
        imageUrl: 'bulbassauro.png',
        members: []
      },
      {
        name: 'Charmander',
        color: '#8F4A43',
        imageUrl: 'charmander.png',
        members: []
      },
      {
        name: 'Squirtle',
        color: '#334555',
        imageUrl: 'squirtle.png',
        members: []
      },
      {
        name: 'Pikachu',
        color: '#E4BE43',
        imageUrl: 'pikachu.png',
        members: []
      },
    ]
  }

  handleGetAllNames = () => {
    const { teams } = this.state;
    const names = teams.map((el) => el.name);

    return names;
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

    if (sizes[teamIndex] >= maxlength) {
      return true;
    }
    return false;
  }

  handleAlreadyFull = () => {
    const { teams, total } = this.state;
    const sizes = teams.map((el) => el.members.length);
    const alreadyFull = sizes.reduce((a, b) => a + b)

    if (alreadyFull >= total) {
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
    // TODO try to make this state machine generic
    const states = {
      0: [1, 2, 3],
      1: [0, 2, 3],
      2: [0, 1, 3],
      3: [0, 1, 2]
    };
    let teamIndex = null;

    if (this.handleAlreadyFull()) {
      teamIndex = null;
    } else if (lastTeamChoosed === null) {
      teamIndex = Math.floor(Math.random() * Object.keys(states).length);
    }
    else if (this.handleGetCurrentMaxTeam(false) - this.handleGetCurrentMinTeam(false) > 1) {
      teamIndex = this.handleGetCurrentMinTeam();
    }
    else {
      do {
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
    if (drawnTeam) {
      const newTeam = [{ ...drawnTeam, members: [...drawnTeam.members, currentInputText] }]
      const newTeams = teams.map(obj => newTeam.find(o => o.name === obj.name) || obj);

      this.setState({ currentInputText: '', teams: newTeams, lastTeamChoosed: drawnTeamIndex });
    } else {
      alert('Total number of people reached');
    }
    event.preventDefault();
  }

  componentDidMount() {
    let total;
    do {
      total = prompt('How many people in total?', 24);
    } while (!total || isNaN(total.replace(/\s/g, "-")));

    this.setState({ total });
  }

  render() {
    const { currentInputText, currentHighlight, teams } = this.state;

    return (
      <div>
        <div className="form-container">
          <form className="form-container" onSubmit={this.handleSubmit}>
            <input type="text" value={currentInputText} onChange={this.handleChange} />
            <input type="submit" value=">" />
          </form>
        </div>
        <div className="teams-container">
          {teams.map((team, index) => {
            return (
              <div key={`${index}-${team.name}`} className={'team-container ' + (team.name === currentHighlight ? 'highlight' : '')} style={{ backgroundColor: team.color }}>
                <h1>{team.name}</h1>
                <img src={require(`../../assets/images/${team.imageUrl}`)} alt={team.name} />
                <div className="members-container">
                  {team.members.map((member, index) => {
                    return (
                      <h4 key={`${index}-${team.name}`}>{member}</h4>
                    )
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}