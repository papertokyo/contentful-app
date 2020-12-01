import React from 'react';
import { isEmpty, map, toString } from 'lodash';
import { Paragraph, DisplayText, IconButton } from '@contentful/forma-36-react-components';
import Image from '../image';

const IMG_WIDTH = 50;
const IMG_HEIGHT = 50;

export class Product extends React.Component {
  renderProductImage() {
    const { product } = this.props;

    return product.image ? (
      <Image src={`${product.image}?padded=true&height=${IMG_HEIGHT}&width=${IMG_WIDTH}`} />
    ) : (
      <Image svgType="empty-product" height={IMG_HEIGHT} width={IMG_WIDTH} />
    );
  }

  renderDescription() {
    const { product } = this.props;

    return (
      <div className="description">
        <DisplayText className="name">{product.name}</DisplayText>
        {product.sku && <Paragraph className="sku">{product.sku}</Paragraph>}
      </div>
    );
  }

  renderOptions() {
    const { product } = this.props;

    return (
      !isEmpty(product.options) && (
        <div className="options">
          {map(product.options, (option) => (
            <Paragraph key={option.id} className="option">{`${option.name}: ${toString(
              option.value,
            )}`}</Paragraph>
          ))}
        </div>
      )
    );
  }

  render() {
    const { onDelete, product } = this.props;

    return (
      <div className="product">
        <div className="title">
          {this.renderProductImage()}
          {this.renderDescription()}
        </div>
        {this.renderOptions()}
        <IconButton
          className="delete"
          onClick={() => onDelete(product.id)}
          buttonType="muted"
          iconProps={{ icon: 'Close', size: 'small' }}
        />
      </div>
    );
  }
}

export default Product;
