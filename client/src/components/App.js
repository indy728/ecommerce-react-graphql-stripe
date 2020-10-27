import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Container, Box, Heading, Card, Image, Text } from 'gestalt';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: []
  }

  async componentDidMount() {
    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `query Brands {
            brands {
              _id
              name
              description
              createdAt
              image {
                url
                name
              }
            }
          }`
        }
      })
      this.setState({brands: response.data.brands})
    } catch(err) {
      console.error('[App] err: ', err)
    }
  }

  render() {
    const {brands} = this.state;

    return (
      <Container>
        {/* Brands section */}
        <Box
          display='flex'
          justifyContent="center"
          marginBottom={2}

        >
          {/* Brands Header */}
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
          {/* Brands */}
        </Box>
        <Box
          display="flex"
          justifyContent="around"
        >
          {brands.map((brand) => (
            <Box key={brand._id} width={200} margin={2}>
              <Card
              image={
                <Box height={200} width={200}>
                  <Image
                    src={`${apiUrl}${brand.image && brand.image.url}`}
                    alt="Brand"
                    naturalHeight={1}
                    naturalWidth={1}
                  />
                </Box>
              }
              >
                <Box display="flex" justifyContent="center" alignItems="center" direction="column">
                  <Text size="xl">{brand.name}</Text>
                  <Text>{brand.description}</Text>
                  <Text size="xl">
                    <Link to={`/${brand._id}`}>
                      See Brews
                    </Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    );
  }
}

export default App;
