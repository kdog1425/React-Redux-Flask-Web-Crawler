/* eslint camelcase: 0, no-underscore-dangle: 0 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchGraphData } from '../actions/data';

class GraphView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'timeout': null,
        }
        this.fetchGraph = this.fetchGraph.bind(this);

    }

    componentWillReceiveProps(nextProps){
        if (nextProps.crawlerId != this.props.crawlerId){
            clearTimeout(this.state.timeout);
        }
    }

    componentWillMount() {
        if (this.state.timeout){
            clearTimeout(this.state.timeout);
        }
        this.fetchGraph(this.props.crawlerId);
    }

    componentWillUnmount() {
        debugger;
        clearTimeout(this.state.timeout);
    }

    fetchGraph() {
        const crawlerId = this.props.crawlerId;
        this.setState({'timeout' : setTimeout(() => {
            console.log(' **** fetching crawlerId [' + crawlerId + '] ****');
            this.props.fetchGraph(crawlerId);
            this.fetchGraph(crawlerId);
        }, 3000)});
    }

    render() {
        return (
            <div id="sigma-container"
             style={{'width':'80%',
                    'height':'80%',
                    'margin':'0 auto',
                    'textAlign':'left',
                    'backgroundColor':'black'}}
            />
        )
    }

}

GraphView.propTypes = {
  graph: PropTypes.object,
  crawlerId: PropTypes.string
};

const mapStateToProps = state => {
  return {
    graph: state.data.graph,
    crawlerId: state.data.crawlerId,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGraph: (crawlerId) => {
      dispatch(fetchGraphData(crawlerId))
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphView);
