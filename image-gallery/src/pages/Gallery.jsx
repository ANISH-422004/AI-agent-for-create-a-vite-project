import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Gallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="row">
      {products.map(product => (
        <div className="col-md-3 mb-4" key={product.id}>
          <div className="card bg-secondary text-light h-100">
            <Link to={`/image/${product.id}`} className="text-decoration-none text-light">
              <img
                src={product.image}
                alt={product.title}
                className="card-img-top p-4"
                style={{ height: '200px', objectFit: 'contain', background: '#222' }}
              />
              <div className="card-body">
                <h6 className="card-title">{product.title}</h6>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Gallery;