import React from 'react';
import { get } from 'lodash';
import Image from '../image';

const IMG_WIDTH = 200;
const IMG_HEIGHT = 200;

export class ProductImage extends React.Component {
  render() {
    const { product } = this.props;
    const image = get(product, 'images[0].file.url');

    return (
      <div className="image">
        {image ? (
          <Image src={`${image}?padded=true&height=${IMG_HEIGHT}&width=${IMG_WIDTH}`} />
        ) : (
          <Image svgType="empty-product" height={IMG_HEIGHT} width={IMG_WIDTH} />
        )}
      </div>
    );
  }
}

export default ProductImage;
