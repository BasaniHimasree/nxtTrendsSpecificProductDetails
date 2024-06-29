import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare} from 'react-icons/bs'
import {BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productsList: {},
    similarProducts: [],
    apiStaus: apiStatusConstants.initial,
    quantity: 1,
  }
  componentDidMount() {
    this.getProductItemDetails()
  }

  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    price: data.price,
    description: data.description,
  })

  getProductItemDetails = async () => {
    const {apiStatus} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const url = `https://apis.ccbp.in/products/${id}`
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const fetchedData = this.getFormattedData(data)

      const updateSimilarProductsData = data.similar_products.map(each =>
        this.getFormattedData(each),
      )
      this.setState({
        productsList: fetchedData,
        similarProducts: updateSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }
  onIncrement = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }
  renderProducts = () => {
    const {productsList, quantity} = this.state
    const {
      imageUrl,
      title,
      brand,
      rating,
      totalReviews,
      availability,
      price,
      description,
    } = productsList

    return (
      <>
        <div>
          <img src={imageUrl} alt="product" />
          <div>
            <h1>{title}</h1>
            <p>{price}</p>
            <div className="card">
              <p>{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-image"
              />
            </div>
            <p>{totalReviews}</p>
            <p>{description}</p>
            <div className="card">
              <p>Available:</p>
              <p>{availability}</p>
            </div>
            <div className="card">
              <p>Brand:</p>
              <p>{brand}</p>
            </div>
            <hr />
            <div className="card">
              <button
                type="button"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="paragraph">{quantity}</p>
              <button
                type="button"
                onClick={this.onIncrement}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button">Add To Cart</button>
          </div>
        </div>
        {this.renderSimilarProducts()}
      </>
    )
  }

  renderSimilarProducts = () => {
    const {similarProducts} = this.state
    return (
      <ul>
        {similarProducts.map(each => (
          <SimilarProductItem similarProduct={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )
  renderProductDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProducts()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div>{this.renderProductDetailsView()}</div>
      </div>
    )
  }
}

export default ProductItemDetails
