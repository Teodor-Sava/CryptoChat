import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../../actions/messaging';

import MessageList from './message-list';
import ReplyMessage from './reply-message';

const socket = actions.socket;

class Conversation extends Component {
  constructor(props) {
    super(props);

    const { params, fetchConversation } = this.props;
    // Fetch conversation thread (messages to/from user)
    fetchConversation(params.conversationId);
    socket.emit('enter conversation', params.conversationId);
    console.log("params");
    console.log(params);
    console.log("props");
    console.log(this.props);
    console.log('state');
    console.log(this.state);

    // Listen for refresh messages from socket server
    socket.on('refresh messages', (data) => {
      fetchConversation(params.conversationId);
    });
  }

  componentWillUnmount() {
    socket.emit('leave conversation', this.props.params.conversationId);
  }

  renderInbox() {
    console.log('renderInbox');
    console.log(this.props);
    if (this.props.messages) {
      return (
        <MessageList displayMessages={this.props.messages} />
      );
    }
  }

  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-body">
            <h4 className="left">Conversation with {(this.props.recipient.firstName+ ' '+ this.props.recipient.lastName)|| ''}</h4>
            <Link className="right" to="/dashboard/inbox">Back to Inbox</Link>
            <div className="clearfix" />
            { this.renderInbox() }
          </div>
        </div>
        <ReplyMessage replyTo={this.props.params.conversationId} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.communication.messages,
      recipient: state.communication.recipient
  };
}

export default connect(mapStateToProps, actions)(Conversation);
