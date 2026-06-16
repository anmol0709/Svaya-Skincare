import { Link } from 'react-router-dom'
import ProductImage from './ProductImage.jsx'
import { formatINR } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { add } = useCart()
  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="visual" aria-label={product.name}>
        <ProductImage product={product} size={300} fill />
      </Link>
      <div className="body">
        <span className="cat">{product.category}{product.hero ? ' . Hero' : ''}</span>
        <Link to={`/product/${product.slug}`} className="name">{product.name}</Link>
        <p className="blurb">{product.blurb}</p>
        <div className="row">
          <span className="price">{formatINR(product.price)}</span>
          <button className="btn btn--ghost" style={{ padding: '0.6rem 1.4rem' }} onClick={() => add(product.sku)}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
