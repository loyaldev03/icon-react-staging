import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {isLoaded as isInfoLoaded, load as loadInfo} from '../../redux/modules/info';
import {isLoaded as isAuthLoaded, load as loadAuth} from '../../redux/modules/auth';
import {push} from 'react-router-redux';
import config from '../../config';
import {asyncConnect} from 'redux-async-connect';

@asyncConnect([{
	promise: ({store: {dispatch, getState}}) => {
		const promises = [];

		if (!isInfoLoaded(getState())) {
			promises.push(dispatch(loadInfo()));
		}
		if (!isAuthLoaded(getState())) {
			promises.push(dispatch(loadAuth()));
		}

		return Promise.all(promises);
	}
}])
@connect(
	state => ({user: state.auth.user}),
	{pushState: push}
)
export default class App extends Component {
	static propTypes = {
		children: PropTypes.object.isRequired,
		user: PropTypes.object,
		pushState: PropTypes.func.isRequired
	};

	static contextTypes = {
		store: PropTypes.object.isRequired
	};

	componentWillReceiveProps(nextProps) {
		if (!this.props.user && nextProps.user) {
			// login
			//this.props.pushState('/loginSuccess');
			this.props.pushState('/');
		} else if (this.props.user && !nextProps.user) {
			// logout
			this.props.pushState('/login');
		}
	}

	handleLogout = (event) => {
		event.preventDefault();
		this.props.logout();
	};

	render() {
		return (
			<div className="test">
				<Helmet {...config.app.head}/>

				<div className="app-wrapper">
					{this.props.children}
				</div>

			</div>
		);
	}
}