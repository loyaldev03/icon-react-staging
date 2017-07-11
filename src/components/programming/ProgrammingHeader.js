import React, {Component, PropTypes} from 'react';
import {connect} from "react-redux";
import {DayPicker, DotList} from '../index';

@connect(
	state => ({
		user: state.authStore.user,
	})
)

export default class ProgrammingHeader extends Component {

	render() {
		const {user} = this.props;

		return user ? (
			<div className="programming-header-wrapper menu-head-buffer">
				<div className="container">
					<div className="row">
						<div className="col-xs-12">
							<DayPicker/>
						</div>
						<div className="col-xs-12">
							<DotList/>
						</div>
					</div>
				</div>
			</div>) : <div/>;
	}
}
