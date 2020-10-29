import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Container, Box, Heading, Text, TextField, Modal, Button, Spinner } from 'gestalt';
import ToastMessage from './ToastMessage';
import Strapi from 'strapi-sdk-javascript/build/main';
import {calculatePriceToString, getCart, clearCart, calculatePriceToNumber} from '../utils';
import {Elements, StripeProvider, CardElement, injectStripe} from 'react-stripe-elements';

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends Component {
  state = {
    address: '',
    postalCode: '',
    city: '',
    confirmationEmailAddress: '',
    toast: false,
    toastMessage: '',
    cartItems: [],
    orderProcessing: false,
    modal: false,
  }

  componentDidMount() {
    this.setState({cartItems: getCart()})
  }

  handleChange = ({event, value}) => {
    this.setState({
      [event.target.name]: value
    })
  }

  handleConfirmOrder = async event => {
    event.preventDefault();
    if (this.isFormEmpty()) {
      this.showToast('Fill in all the fields');
      return
    }
    
    this.setState({
      modal: true
    })
  }

  handleSubmitOrder = async () => {
    const {cartItems, city, address, postalCode, confirmationEmailAddress } = this.state;

    const amount = calculatePriceToNumber(cartItems);

    this.setState({ orderProcessing: true });
    let token;
    try {
      // create stripe token
      const response = await this.props.stripe.createToken();
      token = response.token.id;
      // create order in db with strapi sdk
      await strapi.createEntry('orders', {
        amount,
        brews: cartItems,
        city,
        postalCode,
        address,
        token,
        confirmationEmailAddress
      })
      // set orderProcessing to false
      // hide modal
      this.setState({
        orderProcessing: false, modal: false,
      })
      // clear user cart
      clearCart();
      // show success toast
      this.showToast(`Your order has been successfully submitted!`, true)
    } catch (err) {
      // set orderProcessing & modal to false
      this.setState({
        orderProcessing: false, modal: false,
      })
      // show error toast
      console.error('[Checkout] err: ', JSON.stringify(err))
      console.log('[Checkout] error.code: ', err.code)
      this.showToast(err.message);
    }
  };

  closeModal = () => this.setState({modal: false});

  showToast = (toastMessage, redirect = false) => {
    this.setState({
      toast: true, toastMessage
    })
    setTimeout(() => this.setState({
      toast: false, toastMessage: ''
    }, 
      () => redirect && this.props.history.push('/')
    ), 5000);
  }

  isFormEmpty = () => {
    const {address, postalCode, city, confirmationEmailAddress} = this.state
    return !address || !postalCode || !city || !confirmationEmailAddress
  }

  render() {
    const {toast, toastMessage, cartItems, orderProcessing, modal} = this.state;

    return (
      <Container>
        <Box
          color="darkWash"
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Heading color="midnight">Checkout</Heading>
          {cartItems.length > 0
            ? (<React.Fragment>
                {/* User Cart */}
                <Box
                  color="darkWash"
                  marginTop={4}
                  marginBottom={6}
                  shape="rounded"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  direction="column"
                >
                  <Text color="darkGray" italic>
                    {cartItems.length} items for Checkout
                  </Text>
                  <Box
                    padding={2}
                  >
                    {cartItems.map(item => (
                      <Box 
                        key={item._id}
                        padding={1}
                      >
                        <Text color="midnight">
                          {item.name} x {item.quantity} - ${item.quantity * item.price}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                  <Text bold>Total Amount: {calculatePriceToString(cartItems)}</Text>
                </Box>
                {/* Checkout Form */}
                <form style={{
                  display: 'inlineBlock',
                  textAlign: 'center',
                  maxWidth: 450
                }}
                  onSubmit={this.handleConfirmOrder}
                >
                  {/* Shipping Address Input */}
                  <TextField
                    id="address"
                    type="text"
                    name="address"
                    placeholder="Shipping Address"
                    onChange={this.handleChange}
                  />
                  {/* Postal Code Input */}
                  <TextField
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    onChange={this.handleChange}
                  />
                  {/* City Input */}
                  <TextField
                    id="city"
                    type="text"
                    name="city"
                    placeholder="City of Residence"
                    onChange={this.handleChange}
                  />
                  {/* Confirmation Email Address Input */}
                  <TextField
                    id="confirmationEmailAddress"
                    type="email"
                    name="confirmationEmailAddress"
                    placeholder="Confirmation Email Address"
                    onChange={this.handleChange}
                  />
                  {/* Credit Card Element */}
                  <CardElement
                    id="stripe__input"
                    onReady={input => input.focus()}
                  />
                  <button id="stripe__button" type="submit">Submit</button>
                </form>
              </React.Fragment>)
              : (
                // Default text if no items are in cart
                <Box
                  color="darkWash"
                  shape="rounded"
                  padding={4}
                >
                  <Heading align="center" color="watermelon" size="xs">
                    Your cart is empty
                  </Heading>
                  <Text align="center" italic color="green">Add Some Brews!</Text>
                </Box>
              )
          
        }
            </Box>
            {/* Confirmation Modal */}
            {modal && (
              <ConfirmationModal 
                orderProcessing={orderProcessing}
                cartItems={cartItems}
                closeModal={this.closeModal}
                handleSubmitOrder={this.handleSubmitOrder}
              />
            )}
          <ToastMessage show={toast} message={toastMessage} />
      </Container>
    )
  }
}

const ConfirmationModal = ({orderProcessing, cartItems, closeModal, handleSubmitOrder}) => (
  <Modal
    accessibilityCloseLabel="Close Modal"
    accessibilityModalLabel="Confirm Your Order"
    heading="Confirm Your Order"
    onDismiss={closeModal}
    footer={
      <Box display="flex" marginRight={-1} marginLeft={-1} justifyContent="center">
        <Box
          padding={1}
        >
          <Button
            size="lg"
            color="red"
            text="Submit"
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
          />
        </Box>
        <Box
          padding={1}
        >
          <Button
            size="lg"
            text="Cancel"
            disabled={orderProcessing}
            onClick={closeModal}
          />
        </Box>
      </Box>
    }
    role="alertdialog"
    size="sm"
  >
    {/* Order Summary */}
    {!orderProcessing && (
      <Box color="lightWash" display="flex" justifyContent="center" alignItems="center" direction="column" padding={1}>
        {cartItems.map(item => (
          <Box
            key={item._id}
            padding={1}
          >
            <Text
              size="lg"
              color="red"
            >
              {item.name} x {item.quantity} - ${item.quantity * item.price}
            </Text>

          </Box>
        ))}
        <Box padding={2}>
          <Text
            size="lg"
            bold
          >
            Total: {calculatePriceToString(cartItems)}
          </Text>
        </Box>
      </Box>
    )}

    {/* Order Processing Spinner */}
    <Spinner show={orderProcessing} accessibilityLabel="Order Processing Spinner" />
    {orderProcessing && (
      <Text align="center" italic>Submitting order...</Text>
    )}
  </Modal>
)

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
  <StripeProvider
    apiKey="pk_test_51HhN6UKsQ6mJ0T5x8FKyZqFOCaqbwqKsm8Ljrmlf4pjds5o4WLDSGvDV5U2rnN9qi5FODPIfMOpHkBGniyGyFUwU00uFarqjRY"
  >
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
)

export default Checkout;
