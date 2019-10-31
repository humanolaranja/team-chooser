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
    animationMs: defaultValues.defaultAnimationMs,
    isDrawing: false,
    full: false,
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
    let teamIndex;
    const min = 0;
    const max = this.getSizes(true) - 1;

    if (this.isTeamsAlreadyFull()) {
      teamIndex = null;
    } else if (this.getCurrentMaxTeam(false) - this.getCurrentMinTeam(false) > 1) {
      teamIndex = this.getCurrentMinTeam();
    }
    else {
      do {
        teamIndex = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (teamIndex === this.getCurrentMaxTeam() || this.isTeamAlreadyFull(teamIndex));
    }

    return teamIndex;
  }

  handleChange = (event) => {
    this.setState({ currentInputText: event.target.value });
  }
  
  handleChangePoint = (event) => {
    const { teams } = this.state;
    const team = teams[event.target.id];
    const newTeam = [{ ...team, points: event.target.value }];
    const newTeams = teams.map(obj => newTeam.find(o => o.name === obj.name) || obj);
    
    this.setState({ teams: newTeams });
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

      defaultValues.animate ? this.handleDrawing() : this.setStateWithoutAnimation(newTeams, drawnTeamIndex);
      this.setState({ currentInputText: '', lastTeamChoosed: newTeams, lastTeamChoosedIndex: drawnTeamIndex });
    } else {
      this.getAllMembersNames().indexOf(currentInputText) >= 0 ? alert('Member already in a team') : alert('Please input a valid name');
    }

    event.preventDefault();
  }

  getExtraIteration = () => {
    const { lastTeamChoosedIndex } = this.state;

    return lastTeamChoosedIndex === (this.getSizes(true) - 1) ? 0 : lastTeamChoosedIndex;
  }

  setStateWithoutAnimation = (teams, lastTeamChoosedIndex) => {
    this.setState({ teams, lastTeamChoosedIndex }, () => {
      this.checkFull(true);
    });
  }

  animateDraw = () => {
    const { animationMs, teams, lastTeamChoosedIndex } = this.state;

    if (this.drawIteration >= (this.getSizes(true) * this.animateNumber) + this.getExtraIteration()) {
      this.drawIteration = 0;
      this.setState({ isDrawing: false, isShowingSelected: true, animationMs: defaultValues.defaultAnimationMs, currentHighlight: teams[lastTeamChoosedIndex].name });
      return;
    }

    this.setState({ currentHighlight: Array(this.animateNumber + 1).fill(this.getAllTeamNames()).flat()[this.drawIteration], animationMs: animationMs + defaultValues.slowDownAnimationRate });
    this.drawIteration += 1
  }

  animateSelected = () => {
    const { lastTeamChoosedIndex, teams, lastTeamChoosed } = this.state;

    if (this.showSelected > 3) {
      this.showSelected = 0;
      this.setState({ isShowingSelected: false, teams: lastTeamChoosed, currentHighlight: '' }, () => {
        this.checkFull(true);
      });
      return this.name ? this.name.focus() : 0;
    }

    this.showSelected % 2 !== 0 ? this.setState({ currentHighlight: teams[lastTeamChoosedIndex].name }) : this.setState({ currentHighlight: '' });
    this.showSelected += 1
  }

  checkFull = (timeout = false) => {
    if (this.isTeamsAlreadyFull()) {
      timeout ? setTimeout(this.setFull, 100) : this.setFull();
    }
  }

  setFull = () => {
    alert('Total number of people reached');
    this.setState({ full: true });
  }

  componentDidUpdate() {
    const { isDrawing, isShowingSelected, animationMs } = this.state;
    if (defaultValues.animate) {
      if (isDrawing) setTimeout(this.animateDraw, animationMs);
      if (isShowingSelected) setTimeout(this.animateSelected, animationMs);
    }
  }

  async componentDidMount() {
    let total;
    do {
      total = prompt('How many people in total?', this.state.total);
    } while (!total || isNaN(total.replace(/\s/g, "-")));

    this.setState({ teams, total });
    return this.name ? this.name.focus() : 0;
  }

  render() {
    const { currentInputText, currentHighlight, teams, isDrawing, full } = this.state;

    return (
      <div>
        {!full && (
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
        )}
        {full && (
          <div >
            <div className="teams-container">
              {teams.map((team, index) => (
                <div key={`${index}-${team.name}-points`} className="points-container" style={{ backgroundColor: team.color }}>
                  <input value={team.points} id={index} className="points-input" style={{ backgroundColor: team.color }} onChange={this.handleChangePoint} />
                </div>
              ))}
            </div>
          </div>
        )}
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
                <h2>{team.name}</h2>
                <img src={imageSource} alt={team.name} title={team.name} />
                <div className="members-container">
                  {team.members.map((member, index) => {
                    return (
                      <h5 key={`${index}-${team.name}`}>{member}</h5>
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