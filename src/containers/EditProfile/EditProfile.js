import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {MenubarWhite, Loader, SuccessMessage, ErrorMessage} from '../../components';
import {Link} from "react-router";
import Select from 'react-select';
import {range} from "lodash";
import {connect} from "react-redux";
import {setAuthUserAsEditingUser, changeEditProfileField, editProfile} from "../../redux/modules/editProfileStore";

@connect(
	state => ({
		user: state.auth.user,
		editProfileStore: state.editProfileStore,
	}),
	{setAuthUserAsEditingUser, changeEditProfileField, editProfile}
)

export default class EditProfile extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
		editProfileStore: PropTypes.object.isRequired,
		setAuthUserAsEditingUser: PropTypes.func.isRequired,
		changeEditProfileField: PropTypes.func.isRequired,
		editProfile: PropTypes.func.isRequired
	};

	componentDidMount() {
		this.props.setAuthUserAsEditingUser(this.props.user);
	}

	genderOptions = ['Male', 'Female'].map(val => {
		return {value: val, label: val};
	});

	heightFeetOptions = range(1, 8).map(val => {
		return {value: val, label: `${val} Ft`};
	});

	heightInchesOptions = range(1, 13).map(val => {
		return {value: val, label: `${val} In`};
	});

	static arrowRenderer() {
		return (
			<span className="icon-arrow-down"/>
		)
	};

	changeGender = (gender) => {
		this.props.changeEditProfileField('gender', gender.value);
	};

	changeHeightFt = (heightFt) => {
		this.props.changeEditProfileField('heightFt', heightFt.value);
	};

	changeHeightIn = (heightIn) => {
		this.props.changeEditProfileField('heightIn', heightIn.value);
	};

	handleSubmit = (event) => {
		event.preventDefault();
		const {editProfileStore} = this.props;
		this.props.editProfile({
			name: editProfileStore.editingUser.name,
			email: editProfileStore.editingUser.email,
			gender: editProfileStore.editingUser.gender,
			heightFt: editProfileStore.editingUser.heightFt,
			heightIn: editProfileStore.editingUser.heightIn,
			weight: editProfileStore.editingUser.weight
		});
	};

	render() {
		const {editProfileStore, changeEditProfileField} = this.props;

		const rightSideContent = (
			<Link to="profile" className="text-danger">Cancel</Link>
		);

		return editProfileStore.editingUser ? (
			<div>
				<Helmet title="Edit Profile"/>

				<MenubarWhite title="Edit Profile" rightSideContent={rightSideContent}/>

				<form className="register-page--register-form" onSubmit={this.handleSubmit}>
					<div className="container">

						<div className="row">
							<div className="col-xs-12">

								<div className="upload-avatar-wrapper">
									<img src={editProfileStore.editingUser.avatar_urls[96]}/>
								</div>

								<ErrorMessage error={editProfileStore.error}/>
								<SuccessMessage success={editProfileStore.success}/>

								<div className="form-group">
									<div className="input-group">
										<div className="input-group-addon">
											<span className="icon-user-profile-filled"/>
										</div>
										<input type="text"
													 name="name"
													 value={editProfileStore.editingUser.name}
													 onChange={e => changeEditProfileField(e.target.name, e.target.value)}
													 className="form-control"
													 placeholder="Full Name"/>
									</div>
								</div>

								<div className="form-group">
									<div className="input-group">
										<div className="input-group-addon">
											<span className="icon-email"/>
										</div>
										<input type="email"
													 name="email"
													 value={editProfileStore.editingUser.email}
													 onChange={e => changeEditProfileField(e.target.name, e.target.value)}
													 className="form-control"
													 placeholder="Your Email"/>
									</div>
								</div>

								<div className="form-group">
									<div className="input-group">
										<div className="input-group-addon">
											<span className="icon-gender"/>
										</div>
										<Select className="pretty-select"
														value={editProfileStore.editingUser.gender}
														placeholder="Gender"
														options={this.genderOptions}
														onChange={this.changeGender}
														clearable={false}
														arrowRenderer={EditProfile.arrowRenderer}/>
									</div>
								</div>

								<div className="form-group">
									<div className="row">
										<div className="col-xs-4">
											<Select placeholder="Height (Ft)"
															value={editProfileStore.editingUser.heightFt}
															options={this.heightFeetOptions}
															onChange={this.changeHeightFt}
															clearable={false}
															arrowRenderer={EditProfile.arrowRenderer}
															className="pretty-select"/>
										</div>
										<div className="col-xs-4">
											<Select placeholder="Height (In)"
															value={editProfileStore.editingUser.heightIn}
															options={this.heightInchesOptions}
															onChange={this.changeHeightIn}
															clearable={false}
															arrowRenderer={EditProfile.arrowRenderer}
															className="pretty-select"/>
										</div>
										<div className="col-xs-4">
											<input name="weight"
														 type="number"
														 value={editProfileStore.editingUser.weight}
														 onChange={e => changeEditProfileField(e.target.name, e.target.value)}
														 className="form-control"
														 placeholder="Weight (Kg)"/>
										</div>
									</div>
								</div>

								<button className="btn btn-primary btn-block btn-lg btn-fixed-bottom" type="submit">Save Changes
								</button>

								{editProfileStore.loading ? <Loader/> : undefined}
							</div>
						</div>
					</div>
				</form>
			</div>
		) : <Loader/>;
	}
}