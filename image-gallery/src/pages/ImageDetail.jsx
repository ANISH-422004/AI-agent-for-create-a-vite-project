import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ImageDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="card bg-secondary text-light px-0">
      <div className="row g-0">
        <div className="col-md-5 d-flex align-items-center justify-content-center" style={{ background: '#222' }}>
          <img src={product.image} alt={product.title} className="img-fluid p-5" style={{ maxHeight: 350, objectFit: 'contain' }} />
        </div>
        <div className="col-md-7">
          <div className="card-body">
            <h3 className="card-title mb-3">{product.title}</h3>
            <p className="card-text">{product.description}</p>
            <p className="card-text"><strong>Category:</strong> {product.category}</p>
            <p className="card-text"><strong>Price:</strong> ${product.price}</p>
            <Link className="btn btn-light mt-3" to="/">Back to Gallery</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageDetail;