import * as React from 'react'
import c from 'cxs/component'
import Logo from './logo'

const AvatarImg = c(Logo)({
  height: '32px',
})

const Avatar = () => <AvatarImg alt="Jane Logo" />

const Header = c('header')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  boxShadow: '1px 1px 2px #999',
  justifyContent: 'center',
  alignItems: 'center',
  top: '0px',
  left: '0px',
  width: '100%',
  position: 'fixed',
  padding: '8px',
  background: 'white',
  zIndex: 3,
})

const UserInfo = () => (
  <Header>
    <a href="https://github.com/jane" target="_blank" rel="noopener noreferrer">
      <Avatar />
    </a>
  </Header>
)

export default UserInfo
