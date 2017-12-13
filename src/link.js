import React from 'react';
import { get, set } from 'lodash';

import shallowEqual from './utils/shallowEqual'

export class LinkComponent extends React.Component {

  static contextTypes = { store: () => null }

  getState = () => this.context.store && this.context.store.getState() || {};

  state = get(this.getState(), this.props.path)

  componentWillMount = () => { this.unsubscribe = this.context.store.subscribe(this.update) }

  componentWillUnmount = () => { this.unsubscribe(this.update) }
  
  enhanceAction = (action) => (params) => {
    const result = action(params);
    return typeof result === 'function'
    ? this.enhanceAction(result)
    : this.updateState(result)
  }

  mapActions(actions){
    const mappedActions = {}
    for (const action in actions) {
      mappedActions[action] = this.enhanceAction(actions[action])(this.state)
    }
    return mappedActions
  }


  update = (newState) => {
    const restrictedState = get(newState, this.props.path);
    if (!shallowEqual(restrictedState, this.state)) {
      this.setState(restrictedState)
    }
  }

  updateState = (update) => {
    const actualState = this.getState();
    const clonedState = {...actualState}
    const restrictedState = get(clonedState, this.props.path)
    const newRestrictedState = typeof update === 'function' ? update(restrictedState) : update
    const newState = set(clonedState, this.props.path, newRestrictedState);
    this.context.store.setState(newState)
  }

  

  render(){
    const actions = this.mapActions(this.props.actions)
    return this.props.children({
      ...this.state,
      ...actions,
      updateState: this.updateState
    })
  }
}

export default (path, actions) => (Component) => (props) => 
<LinkComponent {...props} path={path} actions={actions}>
  {(connect) => <Component {...props} {...connect} />}
</LinkComponent>
