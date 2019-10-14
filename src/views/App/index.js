import React, { Component } from 'react';
import teams from '../../config/teams.json';
import defaultValues from '../../config/defaultValues.json';
import '../../styles/main.css';

export default class App extends Component {
  drawIteration = 0;
  showSelected = 0;
  animateNumber = defaultValues.defaultAnimationTimes;
  state = {
    total: defaultValues.totalDefault,
    isDrawing: false,
    isShowingSelected: false,
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

  getAllTeamNames = () => {
    const { teams } = this.state;
    const names = teams.map((el) => el.name);

    return names;
  }

  getAllMembersNames = () => {
    const { teams } = this.state;
    const members = teams.map((el) => el.members);

    return members.flat();
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

    if (drawnTeam && currentInputText && currentInputText.replace(/\s/g, "") && this.getAllMembersNames().indexOf(currentInputText) < 0) {
      const newTeam = [{ ...drawnTeam, members: [...drawnTeam.members, currentInputText] }]
      const newTeams = teams.map(obj => newTeam.find(o => o.name === obj.name) || obj);

      this.handleDrawing();
      this.setState({ currentInputText: '', lastTeamChoosed: newTeams, lastTeamChoosedIndex: drawnTeamIndex });
    } else if(!drawnTeam) {
      alert('Total number of people reached');
    } else {
      this.getAllMembersNames().indexOf(currentInputText) >= 0 ? alert('Member already in a team') : alert('Please input a valid name');
    }

    event.preventDefault();
  }

  getExtraIteration = () => {
    const { lastTeamChoosedIndex } = this.state;

    return lastTeamChoosedIndex === (this.getSizes(true) - 1) ? 0 : lastTeamChoosedIndex;
  }

  animateDraw = () => {
    if (this.drawIteration >= (this.getSizes(true) * this.animateNumber) + this.getExtraIteration()) {
      this.drawIteration = 0;
      this.setState({ isDrawing: false, isShowingSelected: true });
      return;
    }

    this.setState({ currentHighlight: Array(this.animateNumber + 1).fill(this.getAllTeamNames()).flat()[this.drawIteration] });
    this.drawIteration += 1
  }

  animateSelected = () => {
    const { lastTeamChoosedIndex, teams, lastTeamChoosed } = this.state;

    if (this.showSelected > 3) {
      this.showSelected = 0;
      this.setState({ isShowingSelected: false, teams: lastTeamChoosed, currentHighlight: '' });
      this.name.focus();
      return;
    }

    this.showSelected % 2 === 0 ? this.setState({ currentHighlight: teams[lastTeamChoosedIndex].name }) : this.setState({ currentHighlight: '' });
    this.showSelected += 1
  }

  componentDidUpdate() {
    if (this.state.isDrawing) setTimeout(this.animateDraw, defaultValues.defaultAnimationMs);
    if (this.state.isShowingSelected) setTimeout(this.animateSelected, defaultValues.defaultAnimationMs);
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