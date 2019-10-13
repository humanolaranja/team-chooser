import React, { Component } from 'react';
import teams from '../../config/teams.json';
import '../../styles/main.css';

export default class App extends Component {
  iteration = -1; // dont't change this, initial value
  animateNumber = 3; // change this to set how many times in the array animation will run
  state = {
    total: 24, // change this to set default value
    currentInputText: '',
    currentHighlight: '',
    lastTeamChoosedIndex: null,
    lastTeamChoosed: [],
    teams: []
  }

  getSizes = (length = false) => {
    const { teams } = this.state;
    const sizes = teams.map((el) => el.members.length);

    return length ? sizes.length : sizes;
  }

  getAllNames = () => {
    const { teams } = this.state;
    const names = teams.map((el) => el.name);

    return names;
  }

  calculateMaxTeamMembers = () => {
    const { teams, total } = this.state;
    const teamsLength = teams.length;
    const maxlength = total / teamsLength;

    return Math.ceil(maxlength);
  }

  isTeamAlreadyFull = (teamIndex) => {
    const sizes = this.getSizes();
    const maxlength = this.calculateMaxTeamMembers();

    if (sizes[teamIndex] >= maxlength) {
      return true;
    }

    return false;
  }

  isTeamsAlreadyFull = () => {
    const { total } = this.state;
    const sizes = this.getSizes();
    const alreadyFull = sizes.reduce((a, b) => a + b);

    if (alreadyFull >= total) {
      return true;
    }

    return false;
  }

  getCurrentMaxTeam = (index = true) => {
    const sizes = this.getSizes();

    return index ? sizes.indexOf(Math.max(...sizes)) : Math.max(...sizes);
  }

  getCurrentMinTeam = (index = true) => {
    const sizes = this.getSizes();

    return index ? sizes.indexOf(Math.min(...sizes)) : Math.min(...sizes);
  }

  handleDrawTeam = () => {
    const { lastTeamChoosedIndex } = this.state;
    let teamIndex = null;
    const min = 0;
    const max = this.getSizes(true);

    if (this.isTeamsAlreadyFull()) {
      teamIndex = null;
    } else if (lastTeamChoosedIndex === null) {
      teamIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    else if (this.getCurrentMaxTeam(false) - this.getCurrentMinTeam(false) > 1) {
      teamIndex = this.getCurrentMinTeam();
    }
    else {
      do {
        teamIndex = Math.floor(Math.random() * (max - min)) + min;
      } while (teamIndex === this.getCurrentMaxTeam() || this.isTeamAlreadyFull(teamIndex));
    }

    return teamIndex;
  }

  handleChange = (event) => {
    this.setState({ currentInputText: event.target.value });
  }

  handleDrawing = () => {
    if (!this.state.isDrawing)
      this.setState({ isDrawing: true })
  }

  handleSubmit = (event) => {
    const { currentInputText, teams } = this.state;
    const drawnTeamIndex = this.handleDrawTeam();
    const drawnTeam = teams[drawnTeamIndex];

    if (drawnTeam && currentInputText && currentInputText.replace(/\s/g, "")) {
      const newTeam = [{ ...drawnTeam, members: [...drawnTeam.members, currentInputText] }]
      const newTeams = teams.map(obj => newTeam.find(o => o.name === obj.name) || obj);

      this.handleDrawing();
      this.setState({ currentInputText: '', lastTeamChoosed: newTeams, lastTeamChoosedIndex: drawnTeamIndex });
    } else {
      !drawnTeam ? alert('Total number of people reached') : alert('Please input a valid name');
    }

    event.preventDefault();
  }

  animate = () => {
    const { lastTeamChoosedIndex, teams, lastTeamChoosed } = this.state;

    if (this.iteration >= (this.getSizes(true) * this.animateNumber) + lastTeamChoosedIndex) {
      this.iteration = -1;
      this.setState({ isDrawing: false, currentHighlight: teams[lastTeamChoosedIndex].name, teams: lastTeamChoosed });
      this.name.focus();
      return;
    }

    this.iteration += 1

    this.setState({ currentHighlight: Array(this.animateNumber + 1).fill(this.getAllNames()).flat()[this.iteration] });
  }

  componentDidUpdate() {
    if (this.state.isDrawing) setTimeout(this.animate, 100)
  }

  async componentDidMount() {
    let total;
    do {
      total = prompt('How many people in total?', this.state.total);
    } while (!total || isNaN(total.replace(/\s/g, "-")));

    this.setState({ teams, total });
    this.name.focus();
  }

  render() {
    const { currentInputText, currentHighlight, teams, isDrawing } = this.state;

    return (
      <div>
        <div className="form-container">
          <form className="form-container" onSubmit={this.handleSubmit}>
            <input 
              ref={(input) => { this.name = input; }} 
              type="text"
              value={currentInputText}
              disabled={isDrawing}
              onChange={this.handleChange}
            />
            <input type="submit" value=">" />
          </form>
        </div>
        <div className="teams-container">
          {teams.map((team, index) => {
            let imageSource;
            try {
              imageSource = require(`../../assets/images/${team.imageUrl}`);
            } catch (error) {
              imageSource = null;
            }
            return (
              <div key={`${index}-${team.name}`} className={'team-container ' + (team.name === currentHighlight ? 'highlight' : '')} style={{ backgroundColor: team.color }}>
                <h1>{team.name}</h1>
                <img src={imageSource} alt={team.name} title={team.name} />
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