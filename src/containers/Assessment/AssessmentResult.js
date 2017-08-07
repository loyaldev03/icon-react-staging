import React, {Component} from 'react';
import Helmet from 'react-helmet';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from "react-redux";
import {Menubar} from '../../components/index';
import {Polar} from 'react-chartjs-2';
import {Link} from "react-router";
import {includes} from 'lodash';
import assessmentResults from '../../../api/assessmentResults.json';
import CheckAccessLevel from '../HOC/CheckAccessLevel';

@connect(
	state => ({
		answers: state.assessmentStore.answers,
		allTracks: state.allTracksStore.allTracks,
		subscription: state.authStore.user.subscription,
		vaultAccess: state.authStore.user.vaultAccess
	}),
	{}
)

@CheckAccessLevel('assessment')

export default class AssessmentResult extends Component {

	constructor(props) {
		super(props);

		this.state = {
			totalScore: 0,
			radarData: [],
			recommendedTrackName: null
		}
	}

	componentDidMount() {
		const {answers} = this.props;

		let recommendedTrackName = false;
		let recommendedTrack = false;
		let answersAsArray = Object.values(answers);
		let radarData = answersAsArray.slice(1, 8);
		let totalScore = 0;
		let lifestyleCount = 0;

		///////////////
		// total score
		///////////////
		radarData.map(value => totalScore += parseInt(value));


		///////////////
		// check lifestyle
		///////////////
		radarData.map(value => {
			if (value <= 4) lifestyleCount++;
		});

		if ((lifestyleCount > 4 && totalScore <= 27) || answers[8] === 'yes') {
			recommendedTrackName = 'lifestyle';
		}

		///////////////
		// check hyper
		///////////////
		if (radarData.every((value) => (value >= 8 && value <= 10)) && (totalScore >= 56 && totalScore <= 70)) {
			recommendedTrackName = 'hyper';
		}

		///////////////
		// check dynamic
		///////////////
		if (radarData.every((value) => (value >= 4 && value <= 7)) || (totalScore >= 28 && totalScore <= 55)) {
			recommendedTrackName = 'dynamic';
		}

		///////////////
		// check strength
		///////////////
		if ([1, 6, 7].every(value => (value <= 4)) && [2, 3, 4, 5].every(value => (value >= 7)) && totalScore >= 28) {
			recommendedTrackName = 'strength';
		}


		///////////////
		// radar
		///////////////
		let newRadarData = [
			parseInt(answersAsArray[1]),
			Math.floor((parseInt(answersAsArray[6]) + parseInt(answersAsArray[7])) / 2),
			parseInt(answersAsArray[5]),
			parseInt(answersAsArray[3]),
			parseInt(answersAsArray[2]),
			parseInt(answersAsArray[1])
		];

		if (recommendedTrackName) {
			recommendedTrack = this.props.allTracks.filter(track => {
				return track.name === recommendedTrackName;
			})[0];
		}

		this.setState({
			totalScore: totalScore,
			radarData: newRadarData,
			recommendedTrackName: recommendedTrackName,
			recommendedTrack: recommendedTrack
		});
	}

	createMarkup = (html) => {
		return {__html: html};
	};

	render() {
		const data = {
			datasets: [{
				data: this.state.radarData,
				backgroundColor: [
					'rgba(255, 99, 132, 0.8)',
					'rgba(75, 192, 192, 0.8)',
					'rgba(255, 206, 86, 0.8)',
					'rgba(255, 0, 188, 0.8)',
					'rgba(54, 162, 235, 0.8)',
					'rgba(54, 162, 34, 0.8)',
				],
				fillColor: 'red',
				borderWidth: 0,
				label: 'Categories'
			}],
			labels: [
				'Raw Strength',
				'Olympic Lifting',
				'Stamina',
				'Gymnastics',
				'Cardio',
				'Mobility'
			]
		};

		const {totalScore, radarData, recommendedTrackName, recommendedTrack} = this.state;
		const {subscription, vaultAccess} = this.props;

		if (!totalScore || radarData.length === 0 || !recommendedTrackName || !recommendedTrack) {
			return (<div>loading...</div>);
		}

		let trackDetails = assessmentResults.assessment_results.filter((result) => {
			return result.name === recommendedTrackName;
		})[0];

		let style = {backgroundImage: 'url(../../' + recommendedTrack.bgImgUrl + ')'};

		let hasAccessOfProgramming = false;
		if (includes(vaultAccess, 'programming-all')) hasAccessOfProgramming = true;
		else if (includes(vaultAccess, 'programming-lifestyle')) hasAccessOfProgramming = true;
		else if (includes(vaultAccess, 'programming-masters')) hasAccessOfProgramming = true;

		return (
			<ReactCSSTransitionGroup
				transitionName="react-anime"
				transitionAppear={true}
				transitionAppearTimeout={5000}
				transitionEnter={true}
				transitionEnterTimeout={500}
				transitionLeave={true}
				transitionLeaveTimeout={500}
			>
				<Helmet title="Assessment - Result"/>

				<Menubar
					title="Icon Assessment - Result"
					className="menu-color-white menu-bar-transparent"
					backButton={true}
				/>

				<div className="container-fluid assessment-result-wrapper menu-head-buffer" style={style}>
					<div className="overlay-gradient"/>
					<div className="row">
						<div className="col-xs-12 col-sm-6">
							<div className="chart-wrapper">
								<Polar data={data} width={300} height={300} options={{
									legend: {
										display: true,
										labels: {
											fontColor: '#fff',
											fontSize: 16
										}
									},
									scale: {
										ticks: {
											stepSize: 1,
											suggestedMax: 10,
										},
										gridLines: {
											color: '#fff'
										}
									}
								}}/>
							</div>
						</div>
						<div className="col-xs-12 col-sm-6">
							<h1 className="title">
								<span className="title-desc">Track Best Suited For You:</span>
								<div className="title-track-name">{recommendedTrack.name}</div>
							</h1>
							<div className="description" dangerouslySetInnerHTML={this.createMarkup(trackDetails.details || '')}/>
							<div className="btn-wrap">
								{(parseInt(subscription.subscription_id) === 1 || parseInt(subscription.subscription_id) === 11) && (
									<a href="http://54.148.236.111/register/upgrade" target="_blank"
										 className="btn btn-lg btn-icon btn-icon-icon">
										<span className="icon-update-sub"/>Get Access
									</a>
								)}

								{hasAccessOfProgramming && (
									<Link to="/edit-tracks" className="btn btn-lg btn-icon btn-icon-icon"><span
										className="icon-nav-links"/>
										Add Track
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			</ReactCSSTransitionGroup>
		);
	}
}