import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

// Component
import { PostsView } from '..';
import { PostCardPlaceHolder } from '../../basicUIElements';

// Actions
import { isCollapsePostButton } from '../../../redux/actions/uiAction';
/*
 *            Props Name        Description                                     Value
 *@props -->  props name here   description here                                Value Type Here
 *
 */

class PostsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycle Functions

  // Component Functions

  _handleOnScrollStart = () => {
    const { dispatch, isCollapsePostButtonOpen } = this.props;

    if (isCollapsePostButtonOpen) {
      dispatch(isCollapsePostButton(false));
    }
  };

  render() {
    const { currentAccount, isLoginDone, tag } = this.props;

    if (!isLoginDone && !tag) {
      return (
        <Fragment>
          <PostCardPlaceHolder />
          <PostCardPlaceHolder />
        </Fragment>
      );
    }

    return (
      <PostsView
        handleOnScrollStart={this._handleOnScrollStart}
        currentAccountUsername={currentAccount && currentAccount.username}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  currentAccount: state.account.currentAccount,
  isLoggedIn: state.application.isLoggedIn,
  isLoginDone: state.application.isLoginDone,
  isCollapsePostButtonOpen: state.ui.isCollapsePostButton,
});

export default connect(mapStateToProps)(PostsContainer);
