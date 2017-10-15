import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GraphView from '../GraphView.js';

class Home extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section>
                <div className="container text-center">
                    <h1>Crawler ID [{this.props.crawlerId}]</h1>
                    <GraphView />
                </div>
            </section>
        )
    }

}

const mapStateToProps = state => {
  return {
    crawlerId: state.data.crawlerId,
  }
}

export default connect(
  mapStateToProps
)(Home);
