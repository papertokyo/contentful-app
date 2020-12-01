import React from 'react';
import { get, map, isEmpty, times, find, findIndex, reduce, each, filter } from 'lodash';
import {
  SkeletonContainer,
  SkeletonImage,
  SkeletonBodyText,
} from '@contentful/forma-36-react-components';
import Product from '../product';
import { PRODUCTS_LIMIT } from '../../utils/swell-js';
import { getOptions, getDefaultOptionValue } from '../../utils/product';
import Image from '../image';
import Pagination from './pagination';
import Header from './header';
import './styles.css';

class Products extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: isEmpty(props.products),
      selected: props.selected,
      values: this.getValues(props),
      errors: [],
    };

    this.onProductSelect = this.onProductSelect.bind(this);
    this.onChangeProductOptions = this.onChangeProductOptions.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.products !== nextProps.products) {
      this.setState({ isLoading: false });
    }
  }

  getValues(props) {
    const { selected } = props;

    return !isEmpty(selected)
      ? reduce(
          selected,
          (acc, product) => {
            if (!isEmpty(product.options)) {
              acc[product.id] = product.options;
            }

            return acc;
          },
          {},
        )
      : {};
  }

  onChangeProductOptions(product, optionValue) {
    const { values, errors } = this.state;
    const productValues = this.state.values[product.id];
    const errorIndex = findIndex(errors, { product_id: product.id, option_id: optionValue.id });
    if (errorIndex !== -1) {
      errors.splice(errorIndex, 1);
      this.setState({ errors });
    }

    return isEmpty(productValues)
      ? this.setState({
          values: { ...values, [product.id]: [optionValue] },
        })
      : !find(productValues, { id: optionValue.id })
      ? this.setState({
          values: { ...values, [product.id]: [...productValues, optionValue] },
        })
      : this.setState({
          values: {
            ...values,
            [product.id]: map(productValues, (productValue) =>
              productValue.id === optionValue.id && productValue.value !== optionValue.value
                ? optionValue
                : productValue,
            ),
          },
        });
  }

  getSelectedProduct(id) {
    const { products } = this.props;
    const product = find(products, { id });
    return (
      product && {
        id,
        sku: product.sku,
        name: product.name,
        image: get(product, 'images[0].file.url'),
        options: product.options,
      }
    );
  }

  onProductSelect(event) {
    const id = get(event, 'currentTarget.dataset.id');
    const product = this.getSelectedProduct(id);
    if (!id || !product) {
      return;
    }

    let { selected } = this.state;
    const { multiselect } = this.props;
    if (isEmpty(selected)) {
      return this.setState({ selected: [product] });
    }

    const index = findIndex(selected, { id });
    if (index !== -1) {
      selected.splice(index, 1);
    } else if (multiselect) {
      selected.push(product);
    } else {
      selected = [product];
    }

    this.setState({ selected });
  }

  onSubmit() {
    const { onSubmit } = this.props;
    const { selected, values } = this.state;
    const { products, errors } = reduce(
      selected,
      (acc, selectedProduct) => {
        const product = {
          id: selectedProduct.id,
          sku: selectedProduct.sku,
          name: selectedProduct.name,
          image: selectedProduct.image,
        };

        if (!isEmpty(selectedProduct.options)) {
          const options = getOptions(selectedProduct);
          product.options = [];

          each(options, (option) => {
            const optionValue = find(values[selectedProduct.id], { id: option.id });

            if (
              option.required &&
              (option.type === 'text' || option.type === 'textarea') &&
              (!optionValue || !optionValue.value)
            ) {
              acc.errors.push({ product_id: selectedProduct.id, option_id: option.id });
            } else if (!optionValue) {
              product.options.push(getDefaultOptionValue(option));
            } else {
              product.options.push({
                ...optionValue,
                input_type: option.type,
                required: option.required,
              });
            }
          });
        }

        acc.products.push(product);
        return acc;
      },
      {
        products: [],
        errors: [],
      },
    );

    return !isEmpty(errors) ? this.setState({ errors }) : onSubmit(products);
  }

  renderProduct(product) {
    const { selected, values, errors } = this.state;
    const isSelected = !!find(selected, { id: product.id });
    const productValues = values[product.id];
    const productErrors = filter(errors, { product_id: product.id });

    return (
      <Product
        key={product.id}
        product={product}
        values={productValues}
        selected={isSelected}
        errors={productErrors}
        onClick={this.onProductSelect}
        onChangeOptions={this.onChangeProductOptions}
      />
    );
  }

  renderLoading() {
    return times(PRODUCTS_LIMIT, (i) => (
      <div key={i} className="product">
        <div className="image">
          <SkeletonContainer>
            <SkeletonImage width={400} height={300} />
          </SkeletonContainer>
        </div>
        <div className="description">
          <SkeletonContainer>
            <SkeletonBodyText numberOfLines={2} />
          </SkeletonContainer>
        </div>
      </div>
    ));
  }

  renderProducts() {
    const { isLoading } = this.state;
    const { products } = this.props;

    return isLoading
      ? this.renderLoading()
      : map(products, (product) => this.renderProduct(product));
  }

  renderResults() {
    const { emptySearchResult } = this.props;

    return emptySearchResult ? (
      <Image type="no-result" className="no-result" />
    ) : (
      <div className="products">{this.renderProducts()}</div>
    );
  }

  render() {
    const { selected, errors } = this.state;
    const { count, pages, page, multiselect, onPageChange, onSearchChange } = this.props;

    return (
      <div className="dialog">
        <Header
          count={count}
          selected={selected}
          errors={errors}
          multiselect={multiselect}
          onSearchChange={(value) => {
            this.setState({ isLoading: true });
            onSearchChange && onSearchChange(value);
          }}
          onSubmit={this.onSubmit}
        />
        {this.renderResults()}
        <Pagination
          pages={pages}
          page={page}
          onChange={(selectedPage) => {
            this.setState({ isLoading: true });
            onPageChange && onPageChange(selectedPage);
          }}
        />
      </div>
    );
  }
}

export default Products;
