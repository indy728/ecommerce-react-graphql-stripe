import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon, Spinner } from 'gestalt';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';
import Loader from './Loader';

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: '',
    loadingBrands: true,
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
      this.setState({brands: response.data.brands, loadingBrands: false})
    } catch(err) {
      console.error('[App] err: ', err)
      this.setState({loadingBrands: false})
    }
  }

  handleChange = ({value}) => {
    this.setState({searchTerm: value})
  }

  filterBrands = () => {
    const {brands, searchTerm} = this.state;
    
    return brands.filter((brand) => {
      return (
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })
  }

  render() {
    const {searchTerm, loadingBrands} = this.state;

    return (
      <Container>
        {/* Brands search field */}
        <Box
          display="flex"
          justifyContent="center"
          marginTop={4}
        >
          <SearchField
            id="searchField"
            accessibilityLabel="Brands Search Field"
            onChange={this.handleChange}
            value={searchTerm}
            placeholder="Search Brands"
            />
          <Box margin={2}>
            <Icon
              accessibilityLabel="Brands Search Filter Icon"
              icon="filter"  size={20} 
              color={
                searchTerm ? "orange" : 'gray'
              }
            />
          </Box>
        </Box>

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
          wrap
          shape="rounded"
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6c8ec"
            }
          }}
        >
          {this.filterBrands().map((brand) => (
            <Box key={brand._id} width={200} margin={2} paddingY={4}>
              <Card
              image={
                <Box height={200} width={200}>
                  <Image
                    fit="cover"
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
                    <Link to={`/${brand._id}/brews`}>
                      See Brews
                    </Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
        {/* <Spinner show={loadingBrands} accessibilityLabel="Loading Spinner" /> */}
        <Loader show={loadingBrands} />
      </Container>
    );
  }
}

export default App;
