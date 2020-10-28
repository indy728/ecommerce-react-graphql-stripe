import React, {Component} from 'react';
import { Container, Box, Button, Heading, Text, TextField } from 'gestalt';
import ToastMessage from './ToastMessage';
import Strapi from 'strapi-sdk-javascript/build/main';
import Loader from './Loader';
import {setToken} from '../utils';

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl);


class SignUp extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    toast: false,
    toastMessage: '',
    loading: false,
  }
  
  handleChange = ({event, value}) => {
    this.setState({
      [event.target.name]: value
    })
  }

  handleSubmit = async event => {
    event.preventDefault();
    const {username, email, password} = this.state;
    if (this.isFormEmpty()) {
      this.showToast('Fill in all the fields');
      return
    }
      //  Sign Up a User
    try {
      // set loading true
      this.setState({loading: true})
      // make request to register user with strapi
      const response = await strapi.register(username, email, password)
      // set loading false
      this.setState({loading: false})
      // put token to local storage
      setToken(response.jwt);
      // redirect to home page
      this.redirectUser('/');
    } catch (err) { 
      // set loading to false
      this.setState({loading: false})
      // show error message using toast message
      this.showToast(err.message)
    }
  }

  redirectUser = path => {
    this.props.history.push(path)
  }

  showToast = toastMessage => {
    this.setState({
      toast: true, toastMessage
    })
    setTimeout(() => this.setState({
      toast: false, toastMessage: ''
    }), 5000);
  }

  isFormEmpty = () => {
    const {username, email, password} = this.state
    return !username || !email || !password
  }

  render() {
    const {toastMessage, toast, loading} = this.state;

    return (
      <Container>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#ebe2da'
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
        >
          {/* Sign Up Form */}
          <form style={{
            display: 'inlineBlock',
            textAlign: 'center',
            maxWidth: 450
          }}
            onSubmit={this.handleSubmit}
          >
            <Box
              marginBottom={2}
              display="flex"
              direction="column"
              alignItems="center"
            >
              <Heading color="midnight">Let's get started</Heading>
              <Text italic color="orchid">Sign up to order some brews!</Text>
            </Box>
            {/* Username Input */}
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />
            {/* email Input */}
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="email"
              onChange={this.handleChange}
            />
            {/* password Input */}
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
            <Button 
              inline
              color="blue"
              text="Submit"
              type="submit"
              disabled={loading}
            />
          </form>
        </Box>
          <ToastMessage show={toast} message={toastMessage} />
      </Container>
    )
  }
}

export default SignUp;
