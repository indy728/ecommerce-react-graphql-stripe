import React from 'react';
import {Box, Heading, Text, Image} from 'gestalt';
import {NavLink} from 'react-router-dom';

export default () => (
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