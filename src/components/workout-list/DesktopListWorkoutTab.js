import React, {Component} from 'react';
import {Link} from 'react-router';
import {padStart} from 'lodash';
import copy from 'copy-to-clipboard';

export default class TabContentSectionDesktop extends Component {

	constructor(props) {
		super(props);

		this.state = {
			copyText: 'Copy'
		}
	}

	copyContent = () => {
		const {content} = this.props;
		copy(content);
		this.setState({
			copyText: 'Copied'
		});
	}

	render() {
		const {title, track, content} = this.props;

		let chunks = content.split('@@');
		chunks = chunks.filter(chunk => {
			return chunk.trim() !== '';
		});

		let parsedContentObj = [];

		chunks.map(chunk => {
			let parsedChunks = chunk.split('--');
			let optional = false;
			let title = parsedChunks[0];
			let parsedTitle = title.split('OP '); // the space is important
			if (parsedTitle.length === 2) {
				title = parsedTitle[1];
				optional = true;
			}
			parsedChunks.splice(0, 1);
			parsedContentObj.push({
				title,
				lines: parsedChunks,
				optional
			});
		});

		return (
			<div className="tab-content-section-desktop overflow-custom-scroll">
				<div className="tab-content-header-desktop">
					<div className="row">
						<div className="col-xs-6">
							<h2>{title}</h2>
						</div>
						<div className="col-xs-6">
							<div className="workout-copy-wrapper">
								<Link to={`/workout/${track.trackName}/${track.id}`}>
									Workout Mode
									<span className="icon icon-workout-mode"/>
								</Link>
								<a href="javascript:;" onClick={this.copyContent}>
									{this.state.copyText}
									<span className="icon icon-copy"/>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className="tab-content-body-desktop">
					<div className="tab-content-list-item-desktop">
						<div className="tab-list-item-desktop-wrapper">
							<div className="tab-list-item-desktop">
								<div className="tab-item-container-desktop">
									{!content ? <p>No Task</p> : undefined }
									{parsedContentObj.map((chunk, i) => {
										let number = padStart((i + 1).toString(), 2, '0');
										return (
											<div className="item-desktop" key={i}>
												<span className="item-number-desktop">{number}</span>

												<div className={`${chunk.optional ? 'wod-optional' : ''}`}>
													{chunk.optional ? <p className="text-danger">OPTIONAL</p> : undefined}
													<p>{chunk.title}</p>
													<ul className="list-group">
														{chunk.lines.map((line, j) => {
															return (
																<li key={j}>
																	<span className="red-hyphen">&#8212; </span>
																	{line}
																</li>
															)
														})}
													</ul>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}