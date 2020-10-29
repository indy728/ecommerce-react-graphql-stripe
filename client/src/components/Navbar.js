import React, {Component} from 'react';
import {Box, Heading, Text, Image, Button} from 'gestalt';
import {NavLink, withRouter} from 'react-router-dom';
import {getToken, clearCart, clearToken} from '../utils'

class Navbar extends Component {
  handleSignout = () => {
    // clear jwt token
    clearToken();
    // clear cart
    clearCart();
    // redirect home
    this.props.history.push('/');
  }

  render() {
    return getToken() !== null ? <AuthNav handleSignout={this.handleSignout} /> : <UnauthNav />
  }
}

const AuthNav = ({handleSignout}) => (
  <Box
   height={70}
   color="midnight"
   padding={1}
   shape="roundedBottom"
   display="flex"
   alignItems="center"
   justifyContent="around"
   >
     <NavLink to="/checkout" activeClassName="active">
      <Text
        size="xl" color="white"
      >
        Checkout
       </Text>
     </NavLink>

      <NavLink to="/" exact activeClassName="active">
        <Box display="flex" alignItems="center">
        <Box
          height={50}
          width={50}
          marginRight={2}
        >

          <Image
            src="./icons/logo.svg"
            alt="BrewHaha Logo"
            naturalHeight={1}
            naturalWidth={1}
          />
        </Box>
        <Heading size="xs" color="orange">
          BrewHaha
        </Heading>

        </Box>
      </NavLink>

     {/* Signout Button */}
      <Button
        color="transparent"
        text="Sign Out"
        inline
        size="md"
        onClick={handleSignout}
      />

   </Box>
)

const UnauthNav =  () => (
  <Box
   height={70}
   color="midnight"
   padding={1}
   shape="roundedBottom"
   display="flex"
   alignItems="center"
   justifyContent="around"
   >
     <NavLink to="/sign-in" activeClassName="active">
       <Text
        size="x1" color="white">
       Sign In</Text>
     </NavLink>

      <NavLink to="/" exact activeClassName="active">
        <Box display="flex" alignItems="center">
        <Box
          height={50}
          width={50}
          marginRight={2}
        >

          <Image
            src="./icons/logo.svg"
            alt="BrewHaha Logo"
            naturalHeight={1}
            naturalWidth={1}
          />
        </Box>
        <Heading size="xs" color="orange">
          BrewHaha
        </Heading>

        </Box>
      </NavLink>

     <NavLink to="/sign-up" activeClassName="active">
       <Text
        size="x1" color="white">
       Sign Up</Text>
     </NavLink>
   </Box>
)

export default withRouter(Navbar);
