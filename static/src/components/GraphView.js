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
                  this.state.network.fit(); 
                }, 1000),
            'network': null,
        }
        this.setNetworkInstance = this.setNetworkInstance.bind(this);
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
                  this.state.network.fit();
                }, 1000)});
        }

        if (!nextProps.isCrawlerWorking) {
            clearInterval(this.state.timeout);
        }
    }

    setNetworkInstance(nw) {
        this.setState({
            network: nw,
        });
    }

    render() {
        return (
            <Graph graph={this.props.graph} 
              options={this.state.options} 
              events={this.state.events}
              getNetwork={this.setNetworkInstance}
            />
        )
    }

}

GraphView.propTypes = {
  crawlerId: PropTypes.string,
  graph: PropTypes.object,
  isCrawlerWorking: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    crawlerId: state.data.crawlerId,
    graph: state.data.graph,
    isCrawlerWorking: state.data.isCrawlerWorking
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
