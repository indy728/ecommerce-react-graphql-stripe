import React, {Component} from 'react';
import {Box, Heading, Text, Image, Card, Button} from 'gestalt';
import Strapi from 'strapi-sdk-javascript/build/main';
import Loader from './Loader';

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl);

class Brews extends Component {
  state = {
    brews: [],
    brand: '',
    brewsLoading: true,
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
      this.setState({brews: response.data.brand.brews, brand: response.data.brand.name, brewsLoading: false})
    } catch(err) {
      console.error(err);
      this.setState({brewsLoading: false})
    }
  }
  
  render() {
    const {brand, brews} = this.state;

    return (
    <Box
      marginTop={4}
      display="flex"
      justifyContent="center"
      alignItems="start"
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
                      <Button color="blue" text="Add to Cart" />
                    </Text>
                  </Box>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
    )
  }
}

export default Brews