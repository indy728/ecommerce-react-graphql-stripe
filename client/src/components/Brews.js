import React, {Component} from 'react';
import {Box, Heading, Text, Image, Card, Button, Mask, IconButton} from 'gestalt';
import {Link} from 'react-router-dom';
import Strapi from 'strapi-sdk-javascript/build/main';
import Loader from './Loader';
import {calculatePriceToString, setCart, getCart} from '../utils';

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl);

class Brews extends Component {
  state = {
    brews: [],
    brand: '',
    brewsLoading: true,
    cartItems: [],
  }

  async componentDidMount() {
    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `query BrewsByBrand {
            brand (id: "${this.props.match.params.brandId}") {
              _id
              name
              brews {
                _id
                name
                image {
                  url
                }
                price
              }
            }
          }`
        }
      })
      console.log('[Brews] response: ', response)
      this.setState({
        brews: response.data.brand.brews,
        brand: response.data.brand.name, brewsLoading: false,
        cartItems: getCart(),
      })
    } catch(err) {
      console.error(err);
      this.setState({brewsLoading: false})
    }
  }

  addToCart = brew => {
    const alreadyInCart = this.state.cartItems.findIndex((item) => item._id === brew._id);
    let updatedItems = [...this.state.cartItems];

    if (alreadyInCart === -1) {
      updatedItems = updatedItems.concat({
        ...brew,
        quantity: 1,
      })
    } else {
      updatedItems[alreadyInCart].quantity += 1;
    }

    this.setState({cartItems: updatedItems}, () => setCart(updatedItems));
  }

  deleteItemFromCart = id => {
    const filteredItems = this.state.cartItems.filter((item) => item._id !== id);
    this.setState({cartItems: filteredItems}, () => setCart(filteredItems))
  }
  
  render() {
    const {brand, brews, cartItems} = this.state;

    return (
    <Box
      marginTop={4}
      display="flex"
      justifyContent="center"
      alignItems="start"
      dangerouslySetInlineStyle={{
        __style: {
          flexWrap: 'wrap-reverse'
        }
      }}
    >
      {/* Brews Section */}
      <Box display="flex" direction="column" alignItems="center">
        {/* Brews Heading */}
        <Box margin={2}>
          <Heading color="orchid">{brand}</Heading>
        </Box>
        {/* Brews */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#bdcdd9',
            }
          }}
          shape="rounded"
          display="flex"
          justifyContent="center"
          padding={4}
          wrap
        >
          {brews.map((brew) => (
            <Box key={brew._id} width={210} margin={2} paddingY={4}>
              <Card
              image={
                <Box height={250} width={200}>
                  <Image
                    fit="cover"
                    src={`${apiUrl}${brew.image && brew.image.url}`}
                    alt="brew"
                    naturalHeight={1}
                    naturalWidth={1}
                  />
                </Box>
              }
              >
                <Box display="flex" justifyContent="center" alignItems="center" direction="column">
                  <Box marginBottom={2}>
                    <Text size="xl">{brew.name}</Text>
                  </Box>
                  
                  <Text>{brew.description}</Text>
                  <Text color="orchid">{`$${brew.price}`}</Text>
                  <Box marginTop={2}>
                    <Text size="xl">
                      <Button color="blue" text="Add to Cart" onClick={() => this.addToCart(brew)}/>
                    </Text>
                  </Box>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
      <Box marginTop={2} marginLeft={8} alignSelf="end">
        <Mask shape="rounded" wash>
          <Box display="flex" direction="column" alignItems="center" padding={2}>
            {/* User card heading */}
            <Heading align="center" size="sm">Your Cart</Heading>
            <Text color="gray" italic>
              {cartItems.length} items selected
            </Text>

              {/* Cart Items */}

              {cartItems.map((item) => (
                <Box key={item._id} display="flex" alignItems="center">
                  <Text>
                    {item.name} x {item.quantity} - {(+item.quantity * +item.price).toFixed(2)}
                  </Text>
                  <IconButton
                    accessibilityLabel="Delete Item Button"
                    icon="cancel"
                    size="sm"
                    iconColor="red"
                    onClick={() => this.deleteItemFromCart(item._id)}
                  />
                </Box>
              ))}

              <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                <Box margin={2}>
                  {cartItems.length === 0 && (
                    <Text color="red">Please select some items</Text>
                  )}
                </Box>
                <Text size="lg">Total: {calculatePriceToString(cartItems)}</Text>
                <Text>
                  <Link to="/checkout">checkout</Link>
                </Text>
              </Box>
          </Box>
        </Mask>
      </Box>
    </Box>
    )
  }
}

export default Brews