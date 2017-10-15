/* eslint camelcase: 0, no-underscore-dangle: 0 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchGraphData } from '../actions/data';
import { prepareGraph } from '../utils/graph_vis_functions';
import Graph from 'react-graph-vis';


class GraphView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'timeout': null,
            'options': {
                layout: {
                    hierarchical: true
                },
                nodes: {
                    color: "#16c9e0"
                }
            },
            'events': {
                select: function(event) {
                    var { nodes, edges } = event;
                }
            },
            'timeout': 
                setInterval(() => {
                  const crawlerId = this.props.crawlerId; 
                  this.props.fetchGraph(crawlerId);     
                  console.log(this.props.graph);
                }, 2000),
        }
    }

    componentWillUnmount() {
        if (this.state.timeout){
            clearTimeout(this.state.timeout);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.crawlerId != this.props.crawlerId){
            clearInterval(this.state.timeout);
            this.setState({'timeout':setInterval(() => {
                  const crawlerId = this.props.crawlerId; 
                  this.props.fetchGraph(crawlerId);     
                  console.log(this.props.graph);
                }, 2000)});
        }
    }

    render() {
        return (
            <Graph graph={this.props.graph} 
              options={this.state.options} 
              events={this.state.events}
            />
        )
    }

}

GraphView.propTypes = {
  crawlerId: PropTypes.string,
  graph: PropTypes.object
};

const mapStateToProps = state => {
  return {
    crawlerId: state.data.crawlerId,
    graph: state.data.graph
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
