/* eslint camelcase: 0, no-underscore-dangle: 0 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import * as actionCreators from '../actions/data';
import { validateUrl } from '../utils/misc';

function mapStateToProps(state) {
    return {
        statusText: state.auth.statusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

@connect(mapStateToProps, mapDispatchToProps)
export default class NewCrawlerView extends React.Component {

    constructor(props) {
        super(props);
        const redirectRoute = '/home';
        this.state = {
            url: '',
            redirectTo: redirectRoute,
            disabled: true,
        };
    }

    isDisabled() {
        let url_is_valid = false;

        if (this.state.url === '') {
            this.setState({
                url_error_text: null,
            });
        } else if (validateUrl(this.state.url)) {
            url_is_valid = true;
            this.setState({
                url_error_text: null,
                disabled: false,
            });

        } else {
            this.setState({
                url_error_text: 'Sorry, this is not a valid url',
            });
        }


    }

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.requestCrawler(e);
            }
        }
    }

    requestCrawler(e) {
        e.preventDefault();
        this.props.submitCrawlerRequest(this.state.url, this.state.redirectTo);
    }

    render() {
        return (
            <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
                <Paper style={style}>
                    <form role="form">
                        <div className="text-center">
                            <h2>Request new crawler</h2>
                            {
                                this.props.statusText &&
                                    <div className="alert alert-info">
                                        {this.props.statusText}
                                    </div>
                            }

                            <div className="col-md-12">
                                <TextField
                                  hintText="root url"
                                  floatingLabelText="Root Url"
                                  type="url"
                                  errorText={this.state.email_error_text}
                                  onChange={(e) => this.changeValue(e, 'url')}
                                />
                            </div>


                            <RaisedButton
                              disabled={this.state.disabled}
                              style={{ marginTop: 50 }}
                              label="Submit"
                              onClick={(e) => this.requestCrawler(e)}
                            />

                        </div>
                    </form>
                </Paper>

            </div>
        );

    }
}

NewCrawlerView.propTypes = {
    submitCrawlerRequest: React.PropTypes.func,
    statusText: React.PropTypes.string,
};
