import React from 'react';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import { Icon } from '@contentful/forma-36-react-components';
import ProductOptions from './options';
import ProductImage from './image';
import ProductDescription from './description';
import './styles.css';

export class Product extends React.Component {
  render() {
    const { product, className, errors, selected, values, onClick, onChangeOptions } = this.props;

    return (
      <div
        className={cx('product', className, { selected, error: !isEmpty(errors) })}
        onClick={onClick}
        data-id={product.id}
      >
        {selected && <Icon icon="CheckCircle" size="large" className="selected" />}
        <ProductImage product={product} />
        <ProductOptions
          product={product}
          values={values}
          errors={errors}
          onChange={onChangeOptions}
        />
        <ProductDescription product={product} />
      </div>
    );
  }
}

export default Product;
