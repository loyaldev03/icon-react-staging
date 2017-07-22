import React, {Component, PropTypes} from 'react';

export default class FeedLoadMore extends Component {
	static propTypes = {
		'loading': PropTypes.bool.isRequired,
		'allPagesLoaded': PropTypes.bool.isRequired,
		'onClickLoadMore': PropTypes.func.isRequired,
	};

	render() {
		const {loading, allPagesLoaded, onClickLoadMore} = this.props;

		return (
			<div className="text-center block row no-margin-left-right feed-load-more-container">
				{allPagesLoaded ?
					<p className="text-success"><span className="icon-update-sub" />Well looks like you've read everything</p>
					: <button className="btn btn-primary" onClick={onClickLoadMore} disabled={loading}>
						{loading ? 'Loading...' : 'Load More'}
					</button>
				}
			</div>
		);
	}
}
