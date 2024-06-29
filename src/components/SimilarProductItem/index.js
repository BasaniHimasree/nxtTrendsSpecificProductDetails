const SimilarProductItem = props => {
  const {similarProduct} = props
  const {
    imageUrl,
    title,
    brand,
    rating,
    totalReviews,
    availability,
    price,
    description,
  } = similarProduct

  return (
    <div>
      <img src={imageUrl} alt={`similar product ${title}`} />
      <div>
        <h1>{title}</h1>
        <p>{price}</p>
        <p>{rating}</p>
        <p>{totalReviews}</p>
        <p>{description}</p>
        <p>{availability}</p>
        <p>{brand}</p>
      </div>
    </div>
  )
}
export default SimilarProductItem
