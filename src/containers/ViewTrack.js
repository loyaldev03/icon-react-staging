import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {connect} from "react-redux";
import {asyncConnect} from 'redux-async-connect';
import {includes, startsWith, find} from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
	isLoaded as isTracksLoaded,
	load as loadTracks,
	addAsOnlyTrack,
	addToTrackList,
	remove as removeTrack
} from '../redux/modules/selectedTracksStore';
import {
	Menubar,
	NoAccessSubscriptionUpgradeCard,
	NoAccessSubscriptionUpgradeButton,
	EditTracksBanner,
	BtnBottom
} from '../components/index';

@asyncConnect([{
	promise: ({store: {dispatch, getState}}) => {
		const promises = [];

		if (!isTracksLoaded(getState())) {
			promises.push(dispatch(loadTracks()));
		}

		return Promise.all(promises);
	}
}])

@connect(
	state => ({
		allTracks: state.allTracksStore.allTracks,
		selectedTracks: state.selectedTracksStore.selectedTracks,
		vaultAccess: state.authStore.user.vaultAccess
	}),
	{addAsOnlyTrack, addToTrackList, removeTrack}
)

export default class ViewTrack extends Component {
	addAsOnlyTrack = () => {
		this.props.addAsOnlyTrack(this.props.params.name);
	};

	addToTrackList = () => {
		this.props.addToTrackList(this.props.params.name);
	};

	removeTrack = () => {
		this.props.removeTrack(this.props.params.name);
	};

	render() {
		const {vaultAccess} = this.props;

		let accessOfProgrammingType = null;
		if (includes(vaultAccess, 'programming-all')) accessOfProgrammingType = 'programming-all';
		else if (includes(vaultAccess, 'programming-single')) accessOfProgrammingType = 'programming-single';
		else if (includes(vaultAccess, 'programming-masters')) accessOfProgrammingType = 'programming-masters';

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
				<div className="view-track-wrapper">
					<Helmet title="View Track"/>

					<Menubar
						title="View Track"
						className="menu-bar-grey"
						backButton={true}
					/>

					{accessOfProgrammingType ? this.renderViewTrack(accessOfProgrammingType) :
						<NoAccessSubscriptionUpgradeCard permissionName={accessOfProgrammingType}/>}

				</div>
			</ReactCSSTransitionGroup>
		);
	}

	renderViewTrack(accessOfProgrammingType) {
		const {allTracks, selectedTracks, params} = this.props;

		const track = allTracks.filter(track => {
			return track.name === params.name;
		})[0];

		const selectedTrackIsSubscribed = find(selectedTracks, selectedTrack => {
			return selectedTrack.trackName === track.name;
		});


		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-sm-12 col-md-6 view-track-banner">
						<EditTracksBanner
							track={track}
							selectedTracks={selectedTracks}
							singleTrackView={true}
						/>
					</div>
					<div className="col-sm-12 col-md-6 full-height edit-tracks-mid-section--wrapper">
						<div className="view-track-mid-section">
							<h1 className="title">{track.name}</h1>
							<h3 className="sub-title">
								Seeking for adventure out your door?
							</h3>
							<p>
								Warm Up, Workout, Goals for each session, and
								Cool Down/Accessory work are always included.
							</p>
							<p>
								Sessions last no more than one hour so you can
								put your increased fitness to use outside the
								confines of the gym. Icon ambassadors that are
								professionals in other sports or adventure seekers
								need more time outside opf the gym.
							</p>
							{accessOfProgrammingType === 'programming-all' ? this.renderButtonsForProgrammingAll(selectedTrackIsSubscribed) : undefined}
							{accessOfProgrammingType === 'programming-single' ? this.renderButtonsForProgrammingSingle(selectedTrackIsSubscribed) : undefined}
							{accessOfProgrammingType === 'programming-masters' ? this.renderButtonsForProgrammingMasters(selectedTrackIsSubscribed) : undefined}

							{accessOfProgrammingType === 'all' ? this.renderButtonsForProgrammingAll(selectedTrackIsSubscribed) : undefined}
							{accessOfProgrammingType === 'single' ? this.renderButtonsForProgrammingSingle(selectedTrackIsSubscribed) : undefined}
							{accessOfProgrammingType === 'masters' ? this.renderButtonsForProgrammingMasters(selectedTrackIsSubscribed) : undefined}
					</div>
						</div>

				</div>
			</div>
		);
	}



	renderButtonsForProgrammingSingle(selectedTrackIsSubscribed) {
		let visibleTrackStartsWithMasters = startsWith(this.props.params.name, 'masters');

		return (
			<div>
				{selectedTrackIsSubscribed ?
					<BtnBottom
						classNames="btn btn-block btn-lg btn-icon btn-icon-icon"
						title="Remove Track"
						icon={<span className="icon-trash"/>}
						onClick={this.removeTrack}
					/> : undefined}

				{!selectedTrackIsSubscribed && visibleTrackStartsWithMasters ?

					<NoAccessSubscriptionUpgradeButton
						classNames="btn btn-block btn-lg btn-fixed-bottom btn-turquoise btn-font-lg"
						title="Update Subscription"
						icon={<span className="icon-update-sub"/>}
					/> : undefined
				}

				{!selectedTrackIsSubscribed && !visibleTrackStartsWithMasters ?
					<BtnBottom
						classNames="btn btn-block btn-lg btn-icon btn-icon-blue btn-icon-icon"
						title="Add Track"
						icon={<span className="icon-nav-links"/>}
						onClick={this.addAsOnlyTrack}
					/> : undefined
				}
			</div>
		)
	}

	renderButtonsForProgrammingAll(selectedTrackIsSubscribed) {
		let visibleTrackStartsWithMasters = startsWith(this.props.params.name, 'masters');

		return (
			<div>
				{selectedTrackIsSubscribed ?
					<BtnBottom
						classNames="btn btn-block btn-lg btn-icon btn-icon-icon"
						title="Remove Track"
						icon={<span className="icon-trash"/>}
						onClick={this.removeTrack}
					/> : undefined}

				{!selectedTrackIsSubscribed && visibleTrackStartsWithMasters ?
					<NoAccessSubscriptionUpgradeButton
						classNames="btn btn-block btn-lg btn-fixed-bottom btn-turquoise btn-font-lg"
						title="Update Subscription"
						icon={<span className="icon-update-sub"/>}
					/> : undefined
				}

				{!selectedTrackIsSubscribed && !visibleTrackStartsWithMasters ?
					<BtnBottom
						classNames="btn btn-block btn-lg btn-icon btn-icon-blue btn-icon-icon"
						title="Add Track"
						icon={<span className="icon-nav-links"/>}
						onClick={this.addToTrackList}
					/> : undefined
				}
			</div>
		)
	}

	renderButtonsForProgrammingMasters(selectedTrackIsSubscribed) {
		let visibleTrackStartsWithMasters = startsWith(this.props.params.name, 'masters');
		return (
			<div>
				{selectedTrackIsSubscribed ?
					<BtnBottom
						classNames="btn btn-block btn-lg btn-icon btn-icon-icon"
						title="Remove Track"
						icon={<span className="icon-trash"/>}
						onClick={this.removeTrack}
					/> : undefined}

				{!selectedTrackIsSubscribed && visibleTrackStartsWithMasters ?
					<BtnBottom
						classNames="btn btn-block btn-lg btn-icon btn-icon-blue btn-icon-icon"
						title="Add Track"
						icon={<span className="icon-nav-links"/>}
						onClick={this.addAsOnlyTrack}
					/> : undefined
				}

				{!selectedTrackIsSubscribed && !visibleTrackStartsWithMasters ?
					undefined : undefined
				}
			</div>
		)
	}
}
