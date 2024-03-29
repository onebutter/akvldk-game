import React, { Component } from 'react';
import Weapons from './Weapons';
import { inject, observer } from 'mobx-react';
import { css } from 'emotion';

@inject('gameStore', 'userStore', 'rspStore')
@observer
class MyChoice extends Component {
  onSelectHandler = e => {
    const { setWeapon } = this.props.rspStore;
    setWeapon(e);
  }

  render() {
    const { displayName } = this.props.userStore;
    const selected = this.props.rspStore.weapon;
    return (
      <div className={rootCx}>
        <div className={dpNameCx}>{displayName}</div>
        <Weapons onSelect={this.onSelectHandler} selected={selected} />
      </div>
    );
  }
}

const rootCx = css({

});
const dpNameCx = css({
  marginBottom: '0.3rem',
  textAlign: 'center'
});

export default MyChoice;