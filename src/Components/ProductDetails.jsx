import React from 'react';
import PropTypes from 'prop-types';
import { getProductById } from '../services/api';
import Review from './Review';

class ProductDetails extends React.Component {
  state = {
    detailProduct: [],
    itemsInCart: [],
  };

  async componentDidMount() {
    await this.getProductStorage();
    if (localStorage.getItem('produto') === null) {
      localStorage.setItem('produto', JSON.stringify([]));
    }
    this.showItemsCart();
  }

  showItemsCart = () => {
    const itemsCart = JSON.parse(localStorage.getItem('produto'));
    if (itemsCart !== null) {
      this.setState({
        itemsInCart: itemsCart.length,
      });
    }
  };

  goCart = () => {
    const { history } = this.props;
    history.push('/shopping-cart');
  };

  getProductStorage = async () => {
    const getProduct = localStorage.getItem('detail');
    const selectedProduct = await getProductById(getProduct);
    this.setState({
      detailProduct: [selectedProduct],
    });
  };

  handleClick = () => {
    const { detailProduct } = this.state;
    const { price, title, thumbnail } = detailProduct[0];
    const availableQuantity = detailProduct[0].available_quantity;
    console.log(availableQuantity);
    const allItems = JSON.parse(localStorage.getItem('produto'));
    console.log(allItems);
    allItems.push({ price, title, thumbnail, availableQuantity });
    localStorage.setItem('produto', JSON.stringify(allItems));
    this.showItemsCart();
  };

  render() {
    const { detailProduct, itemsInCart } = this.state;

    return (
      <div>
        <button
          type="button"
          data-testid="shopping-cart-button"
          onClick={ this.goCart }
        >
          Carrinho(
          <span data-testid="shopping-cart-size">{itemsInCart}</span>
          )
        </button>

        {detailProduct.map((element) => (
          <div key={ `${element.id}` }>
            <div>
              <h3 data-testid="product-detail-name">{`${element.title}`}</h3>
              <img
                src={ `${element.thumbnail}` }
                alt={ `${element.title}` }
                data-testid="product-detail-image"
              />
            </div>
            <div>
              <h3 data-testid="product-detail-price">{`${element.price}`}</h3>
              { element.shipping.free_shipping && <h4>Frete Grátis!</h4>}
            </div>
            <button
              type="button"
              onClick={ this.handleClick }
              data-testid="product-detail-add-to-cart"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
        {detailProduct.length > 0 && <Review productId={ detailProduct[0].id } />}
      </div>
    );
  }
}

ProductDetails.propTypes = {
  history: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default ProductDetails;
